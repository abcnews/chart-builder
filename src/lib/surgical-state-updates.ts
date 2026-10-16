import { diff } from 'deep-object-diff';

export type Obj = Record<string, any>;

let removalCounts: WeakMap<object, number>;

const isPOJO = (d: unknown): d is Obj => {
  if (d === null || typeof d !== 'object') return false;
  const proto = Object.getPrototypeOf(d);
  if (proto === null) return true;
  return proto === Object.prototype;
};

const isRecursable = (d: unknown, t: unknown, s: unknown) => {
  return (
    Array.isArray(t) === Array.isArray(s) &&
    (Array.isArray(d) || isPOJO(d)) &&
    (Array.isArray(t) || isPOJO(t)) &&
    (Array.isArray(s) || isPOJO(s))
  );
};

/**
 * Replace values in the target object to match values in the source object.
 * This has special handling for arrays to ensure only array indexes that need to be changed are changed.
 *
 * @param key The key of the value to be replaced
 * @param target The target object which should be mutated to match source
 * @param source The source object from which to take updated values
 */
const replace = (key: string, target: Obj, source: Obj): void => {
  console.log('key, target, source :>> ', key, target, source);
  if (Array.isArray(target)) {
    if (+key < source.length) target[+key] = source[key]; // includes undefined
    return; // tail removals handled by the length fix in apply
  }
  if (source[key] === undefined) delete target[key];
  else target[key] = source[key];
};

/**
 * Use a diff object to apply changes to `target` so that it matches `source`.
 * @param objDiff A diff object as returned from the deep-object-diff library
 * @param target The target object which should be mutated to match source
 * @param source The source object (the same object supplied as the second argument to diff)
 */
const apply = (objDiff: Obj, target: Obj, source: Obj): void => {
  console.log('objDiff, target, source :>> ', objDiff, target, source);
  for (const key in objDiff) {
    const d = objDiff[key];
    const t = target[key];
    const s = source[key];

    if (isRecursable(d, t, s)) {
      apply(d, t, s);
    } else {
      replace(key, target, source);
    }
  }
  if (Array.isArray(target) && Array.isArray(source)) target.length = source.length;
};

/**
 * Take two complete objects and surgically mutate the first argument into an object that matches the second argument.
 * Only elements that need to be changed should be touched.
 *
 * Notes:
 * - New objects in `source` that aren't already in `target` are added to `target` by reference.
 * - Only plain javascript objects are recursed into. Non-POJO objects in are added or replaced by reference.
 * - Item removal from arrays of objects can result in object identity changing/moving between indexes — not ideal.
 *
 * @param target An object to mutate (the target) to match a source
 * @param source An object which the target argument should be mutated to match (the source)
 */
export const update = <T extends Obj, S extends Obj>(target: T, source: S): void => {
  removalCounts = new WeakMap<object, number>();
  apply(diff(target, source), target, source);
};
