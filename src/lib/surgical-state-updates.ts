export type Obj = Record<string, any>;

type Kind = 'array' | 'object' | 'other';
type ObjectWeakSet = WeakSet<object>;

/** Keys that must never be read or written during a merge to avoid prototype polution. */
const UNSAFE_KEY = '__proto__';

const hasOwn = (o: object, key: PropertyKey): boolean => Object.prototype.hasOwnProperty.call(o, key);

/**
 * Plain objects only: `{}` literals, `JSON.parse` output and `Object.create(null)`
 * This is not deep — just tests the object passed in, not its content.
 */
const isPOJO = (d: unknown): d is Obj => {
  if (d === null || typeof d !== 'object' || d === Object.prototype) {
    return false;
  }
  const proto = Object.getPrototypeOf(d);
  return proto === null || proto === Object.prototype;
};

/**
 * Return what kind of value the argument is.
 */
const kindOf = (d: unknown): Kind => (Array.isArray(d) ? 'array' : isPOJO(d) ? 'object' : 'other');

/**
 * Test for existence of an object in a weak set and add it.
 * @throws {TypeError} Throws a tyep error if the object already exists in the set.
 */
const enter = (seen: ObjectWeakSet, obj: object): void => {
  if (seen.has(obj)) throw new TypeError('Circular reference detected in source');
  seen.add(obj);
};

/**
 * Copy a source value so the target never shares mutable structure with the source. This doesn't use `structuredClone`
 * so it can implement special handling for some object types.
 *
 * Arrays, plain objects and Dates are copied. Everything else (Map, Set, class instances, functions, ...) is kept by reference.
 */
const clone = (value: any, seen: ObjectWeakSet): any => {
  // Copy dates by creating a new instance with the same time.
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  const kind = kindOf(value);

  // If it's not a plain JS object or an array, return it as is, no clone.
  if (kind === 'other') return value;

  // Record that we've seen this value to avoid circular references.
  enter(seen, value);

  try {
    if (kind === 'array') {
      // New array
      const out: unknown[] = new Array(value.length); // preserves holes

      // Recursively clone the value in each array index
      for (const i of Object.keys(value)) {
        out[+i] = clone(value[+i], seen);
      }

      return out;
    }

    // Else it's an object: create a new one with the same prototype
    const out: Obj = Object.getPrototypeOf(value) === null ? Object.create(null) : {};

    // Recursively clone the value for each of the object's keys
    for (const key of Object.keys(value)) {
      if (key !== UNSAFE_KEY) out[key] = clone(value[key], seen);
    }

    return out;
  } finally {
    seen.delete(value);
  }
};

/**
 * Make `target[key]` match `sourceValue`, touching as little as possible.
 * - identical value: no write
 * - both arrays / both plain objects: recurse (container identity kept)
 * - both Dates: mutate in place when the time differs
 * - anything else: assign a copy of the source value
 */
const syncValue = (target: Obj, key: string | number, sourceValue: any, seen: ObjectWeakSet): void => {
  const present = hasOwn(target, key);
  const targetValue = present ? target[key] : undefined;

  // No write if values are identical.
  if (present && Object.is(targetValue, sourceValue)) return;

  const targetKind = kindOf(targetValue);
  if (targetKind !== 'other' && targetKind === kindOf(sourceValue)) {
    // Recurse into the tree
    update(targetValue, sourceValue, seen);
    return;
  }

  // Special handling for dates.
  if (targetValue instanceof Date && sourceValue instanceof Date) {
    if (!Object.is(targetValue.getTime(), sourceValue.getTime())) targetValue.setTime(sourceValue.getTime());
    return;
  }

  // If we have mismatched types between target and source or it's another data type we don't explicitly handle, clone
  // source and assign to target.
  target[key] = clone(sourceValue, seen);
};

/**
 * Update a target object with the values from a source object, recursively.
 *
 * @param target The object to mutate so it matches `source`
 * @param source The object to take values from when mutating `target`
 * @param seen A set of `source` objects already visited, to avoid circular references.
 */
const syncObject = (target: Obj, source: Obj, seen: ObjectWeakSet): void => {
  // Go through the target first and remove any properties that don't exist on source.
  for (const key of Object.keys(target)) {
    if (key !== UNSAFE_KEY && !hasOwn(source, key)) delete target[key];
  }

  // Go through source and update target with new values.
  for (const key of Object.keys(source)) {
    if (key !== UNSAFE_KEY) syncValue(target, key, source[key], seen);
  }
};

/**
 * Update a target array with values from a source array, recursively.
 *
 * @param target The array to mutate so it matches `source`
 * @param source The array to take values from when mutating `target`
 * @param path A set of `source` arrays already visited, to avoid circular referenes.
 */
const syncArray = (target: any[], source: any[], path: ObjectWeakSet): void => {
  for (let i = 0; i < source.length; i++) {
    if (hasOwn(source, i)) syncValue(target, i, source[i], path);
    else if (hasOwn(target, i)) delete target[i]; // source has a hole here
  }
  // Tail removals (and trailing holes). Guarded so a no-op never writes.
  if (target.length !== source.length) target.length = source.length;
};

/**
 * Take two complete objects and surgically mutate the first argument into an object that matches the second.
 * Only values that differ are written.
 *
 * Behaviour:
 * - Plain objects and arrays are walked recursively and keep their identity when their type is unchanged.
 * - Dates are updated in place via `setTime`.
 * - Everything else (Map, Set, class instances, ...) is compared with `Object.is` and replaced by reference.
 * - Values copied in from `source` are cloned (arrays, plain objects, Dates), so the target never aliases the source.
 * - `__proto__` keys in the source are ignored. Only own properties of the target are considered.
 * - Key order follows the target, with new keys appended in source order.
 * - Removing items from the middle of an array of objects shifts indexes, so object identity can move between
 *   slots. There is no key to match on, so this is inherent.
 *
 * @throws TypeError if the roots aren't both arrays or both plain objects, or if `source` contains a cycle.
 *
 * @param target The target to mutate so it matches `source` — could be an array or an object (but must be the same type
 * as source).
 * @param source The source to mutate `target` to match — could be an array or object (but must be the same type as target)
 * @param seen A WeakSet to keep track of which source items have already been seen, to avoid circular references.
 */
export const update = (target: Obj, source: Obj, seen: ObjectWeakSet = new WeakSet()): void => {
  const targetKind = kindOf(target);
  const sourceKind = kindOf(source);
  if (targetKind === 'other' || targetKind !== sourceKind) {
    throw new TypeError('update(): target and source must both be plain objects or both be arrays');
  }

  enter(seen, source);

  try {
    if (Array.isArray(target)) {
      syncArray(target, source as any[], seen);
    } else {
      syncObject(target, source, seen);
    }
  } finally {
    seen.delete(source);
  }
};
