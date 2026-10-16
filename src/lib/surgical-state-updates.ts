/** A plain object whose values we know nothing about. */
type PlainObject = Record<string, unknown>;
type ObjectWeakSet = WeakSet<object>;

/** Strips `readonly` (shallow). Homomorphic, so arrays and tuples stay arrays and tuples. */
type Writable<T> = { -readonly [K in keyof T]: T[K] };

/** Keys that must never be read or written during a merge to avoid prototype pollution. */
const UNSAFE_KEY = '__proto__';

const hasOwn = (o: object, key: PropertyKey): boolean => Object.prototype.hasOwnProperty.call(o, key);

/** Narrows to `unknown[]` rather than the `any[]` that `Array.isArray` gives for an `unknown` input. */
const isArray = (d: unknown): d is unknown[] => Array.isArray(d);

/**
 * Plain objects only: `{}` literals, `JSON.parse` output and `Object.create(null)`.
 * This is not deep — it only tests the object passed in, not its content.
 */
const isPOJO = (d: unknown): d is PlainObject => {
  if (d === null || typeof d !== 'object' || d === Object.prototype) {
    return false;
  }
  const proto = Object.getPrototypeOf(d);
  return proto === null || proto === Object.prototype;
};

/**
 * Add an object to the set of objects currently being walked.
 * @throws {TypeError} if the object is already in the set (circular reference).
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
const clone = (value: unknown, seen: ObjectWeakSet): unknown => {
  if (value instanceof Date) return new Date(value.getTime());

  if (isArray(value)) {
    enter(seen, value);
    try {
      const out: unknown[] = new Array(value.length); // preserves holes
      for (const i of Object.keys(value)) out[+i] = clone(value[+i], seen);
      return out;
    } finally {
      seen.delete(value);
    }
  }

  if (isPOJO(value)) {
    enter(seen, value);
    try {
      const out: PlainObject = Object.getPrototypeOf(value) === null ? Object.create(null) : {};
      for (const key of Object.keys(value)) {
        if (key !== UNSAFE_KEY) out[key] = clone(value[key], seen);
      }
      return out;
    } finally {
      seen.delete(value);
    }
  }

  // Not a plain object or array: keep by reference.
  return value;
};

/**
 * Make `target[key]` match `sourceValue`, touching as little as possible.
 * - identical value: no write
 * - both arrays / both plain objects: recurse (container identity kept)
 * - both Dates: mutate in place when the time differs
 * - anything else: assign a copy of the source value
 *
 * `K` ties the key type to the holder's index signature, so arrays take numeric keys and objects take string keys.
 */
const syncValue = <K extends string | number>(
  target: Record<K, unknown>,
  key: K,
  sourceValue: unknown,
  seen: ObjectWeakSet
): void => {
  const present = hasOwn(target, key);
  const targetValue = present ? target[key] : undefined;

  if (present && Object.is(targetValue, sourceValue)) return;

  if (isArray(targetValue) && isArray(sourceValue)) {
    syncArray(targetValue, sourceValue, seen);
  } else if (isPOJO(targetValue) && isPOJO(sourceValue)) {
    syncObject(targetValue, sourceValue, seen);
  } else if (targetValue instanceof Date && sourceValue instanceof Date) {
    if (!Object.is(targetValue.getTime(), sourceValue.getTime())) targetValue.setTime(sourceValue.getTime());
  } else {
    // Mismatched types, or a type we don't recurse into: assign a copy.
    target[key] = clone(sourceValue, seen);
  }
};

/**
 * Update a target object with the values from a source object, recursively.
 */
const syncObject = (target: PlainObject, source: PlainObject, seen: ObjectWeakSet): void => {
  enter(seen, source);
  try {
    for (const key of Object.keys(target)) {
      if (key !== UNSAFE_KEY && !hasOwn(source, key)) delete target[key];
    }
    for (const key of Object.keys(source)) {
      if (key !== UNSAFE_KEY) syncValue(target, key, source[key], seen);
    }
  } finally {
    seen.delete(source);
  }
};

/**
 * Update a target array with values from a source array, recursively.
 */
const syncArray = (target: unknown[], source: readonly unknown[], seen: ObjectWeakSet): void => {
  enter(seen, source);
  try {
    for (let i = 0; i < source.length; i++) {
      if (hasOwn(source, i)) syncValue(target, i, source[i], seen);
      else if (hasOwn(target, i)) delete target[i]; // source has a hole here
    }
    // Tail removals (and trailing holes). Guarded so a no-op never writes.
    if (target.length !== source.length) target.length = source.length;
  } finally {
    seen.delete(source);
  }
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
 * Types: this is an assertion function. After the call, TypeScript treats `target` as having the type of `source`
 * (with `readonly` stripped from the top level). Parameters are `object` rather than an index-signature type so
 * interfaces are accepted; the plain-object/array requirement is enforced at runtime.
 *
 * @throws TypeError if the roots aren't both arrays or both plain objects, or if `source` contains a cycle.
 *
 * @param target The array or plain object to mutate so it matches `source`. Must be the same kind as `source`.
 * @param source The array or plain object to match. Not mutated.
 */
export function update<T extends object>(target: object, source: T): asserts target is Writable<T> {
  if (isArray(target) && isArray(source)) {
    syncArray(target, source, new WeakSet());
  } else if (isPOJO(target) && isPOJO(source)) {
    syncObject(target, source, new WeakSet());
  } else {
    throw new TypeError('update(): target and source must both be plain objects or both be arrays');
  }
}
