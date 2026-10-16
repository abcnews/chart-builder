export type WriteRecord = {
  op: 'set' | 'delete' | 'define';
  path: string;
  value?: unknown;
};

const isWrappable = (v: unknown): v is object => {
  if (v === null || typeof v !== 'object') return false;
  if (Array.isArray(v)) return true;
  const proto = Object.getPrototypeOf(v);
  return proto === null || proto === Object.prototype;
};

const join = (base: string, key: PropertyKey): string => (base ? `${base}.${String(key)}` : String(key));

/**
 * Wrap a plain object/array tree in a Proxy that records every mutation.
 *
 * Pass `proxy` to the code under test, then assert on `writes` (what was touched)
 * and on the original `root` (the resulting state). Nested plain objects and arrays are wrapped lazily
 * and consistently, so repeated reads of the same child return the same proxy.
 *
 * Limitations: only plain objects and arrays are tracked. In-place mutation of other objects
 * (e.g. `Date#setTime`, `Map#set`) is not recorded. Assert on those directly.
 */
export function trackWrites<T extends object>(root: T): { proxy: T; writes: WriteRecord[] } {
  const writes: WriteRecord[] = [];
  const cache = new WeakMap<object, object>();

  const wrap = <O extends object>(obj: O, path: string): O => {
    const cached = cache.get(obj);
    if (cached) return cached as O;

    const proxy = new Proxy(obj, {
      get(t, key, receiver) {
        const value = Reflect.get(t, key, receiver);
        if (typeof key !== 'symbol' && Object.prototype.hasOwnProperty.call(t, key) && isWrappable(value)) {
          return wrap(value, join(path, key));
        }
        return value;
      },
      set(t, key, value) {
        writes.push({ op: 'set', path: join(path, key), value });
        // No receiver: avoids re-entering this proxy's defineProperty trap and double-logging.
        return Reflect.set(t, key, value);
      },
      deleteProperty(t, key) {
        writes.push({ op: 'delete', path: join(path, key) });
        return Reflect.deleteProperty(t, key);
      },
      defineProperty(t, key, descriptor) {
        writes.push({ op: 'define', path: join(path, key), value: descriptor.value });
        return Reflect.defineProperty(t, key, descriptor);
      }
    });

    cache.set(obj, proxy);
    return proxy;
  };

  return { proxy: wrap(root, ''), writes };
}
