import { describe, expect, it } from 'vitest';
import { update } from './surgical-state-updates';
import { trackWrites } from './track-writes';

type Obj = Record<string, any>;

describe('minimal writes', () => {
  it('does zero writes for a noop', () => {
    const target = { a: 'a', n: { x: 1, list: [1, { k: 'v' }] } };
    const source = structuredClone(target);
    const { proxy, writes } = trackWrites(target);
    update(proxy, source);
    expect(writes).toEqual([]);
    expect(target).toStrictEqual(source);
  });

  it('writes only the changed leaf', () => {
    const target = { a: 1, nested: { x: 1, y: 2 }, arr: [1, 2] };
    const { proxy, writes } = trackWrites(target);
    update(proxy, { a: 1, nested: { x: 1, y: 3 }, arr: [1, 2] });
    expect(writes).toEqual([{ op: 'set', path: 'nested.y', value: 3 }]);
  });

  it('writes one delete for one removed key', () => {
    const target: Obj = { a: 1, b: 2 };
    const { proxy, writes } = trackWrites(target);
    update(proxy, { a: 1 });
    expect(writes).toEqual([{ op: 'delete', path: 'b' }]);
  });

  it('shrinking an array only writes length', () => {
    const target = { arr: ['a', 'b', 'c'] };
    const { proxy, writes } = trackWrites(target);
    update(proxy, { arr: ['a', 'b'] });
    expect(writes).toEqual([{ op: 'set', path: 'arr.length', value: 2 }]);
  });

  it('growing an array only writes the new index', () => {
    const target = { arr: ['a'] };
    const { proxy, writes } = trackWrites(target);
    update(proxy, { arr: ['a', 'b'] });
    expect(writes).toEqual([{ op: 'set', path: 'arr.1', value: 'b' }]);
  });

  it('is idempotent with zero writes on the second call', () => {
    const target = { arr: ['one', 'two', 'three', 'four'], o: { a: 1 } };
    const source = { arr: ['two', 'four'], o: { a: 2, b: 3 } };
    update(trackWrites(target).proxy, source);
    const { proxy, writes } = trackWrites(target);
    update(proxy, source);
    expect(writes).toEqual([]);
  });

  it('leaves an equal Date untouched and updates a different one in place', () => {
    const date = new Date(5);
    const target = { d: date };
    update(target, { d: new Date(5) });
    expect(target.d).toBe(date);
    update(target, { d: new Date(9) });
    expect(target.d).toBe(date);
    expect(date.getTime()).toBe(9);
  });

  it('does not write when a NaN-valued key is unchanged', () => {
    const target = { n: NaN };
    const { proxy, writes } = trackWrites(target);
    update(proxy, { n: NaN });
    expect(writes).toEqual([]);
  });

  it('distinguishes -0 from 0', () => {
    const target = { n: 0 };
    update(target, { n: -0 });
    expect(Object.is(target.n, -0)).toBe(true);
  });
});

describe('aliasing', () => {
  it('does not share new subtrees with the source', () => {
    const source = { added: { n: { deep: 1 } }, list: [{ id: 1 }] };
    const target: Obj = {};
    update(target, source);
    expect(target.added).not.toBe(source.added);
    expect(target.added.n).not.toBe(source.added.n);
    expect(target.list[0]).not.toBe(source.list[0]);
    source.added.n.deep = 2;
    source.list[0]!.id = 2;
    expect(target.added.n.deep).toBe(1);
    expect(target.list[0]!.id).toBe(1);
  });

  it('does not share subtrees between two targets updated from one source', () => {
    const source = { sub: { v: 1 } };
    const a: Obj = {};
    const b: Obj = {};
    update(a, source);
    update(b, source);
    expect(a.sub).not.toBe(b.sub);
    a.sub.v = 99;
    expect(b.sub.v).toBe(1);
  });

  it('never mutates an earlier source on later updates', () => {
    const s1 = { sub: { v: 1 }, arr: [1, 2] };
    const s2 = { sub: { v: 2 }, arr: [1] };
    const snapshot = structuredClone(s1);
    const target: Obj = {};
    update(target, s1);
    update(target, s2);
    expect(s1).toStrictEqual(snapshot);
  });

  it('does not alias a Date inserted from the source', () => {
    const source = { d: new Date(1) };
    const target: Obj = {};
    update(target, source);
    expect(target.d).not.toBe(source.d);
    expect(target.d.getTime()).toBe(1);
  });
});

describe('prototype pollution', () => {
  const baseline = Object.getOwnPropertyNames(Object.prototype).sort();
  const expectClean = () => {
    expect(({} as any).polluted).toBeUndefined();
    expect(Object.getOwnPropertyNames(Object.prototype).sort()).toStrictEqual(baseline);
  };

  it('ignores a top-level __proto__ key', () => {
    update({}, JSON.parse('{"__proto__": {"polluted": true}}'));
    expectClean();
  });

  it('ignores a nested __proto__ key and keeps the prototype', () => {
    const target: Obj = { a: {} };
    update(target, JSON.parse('{"a": {"__proto__": {"polluted": true}}}'));
    expectClean();
    expect(Object.getPrototypeOf(target.a)).toBe(Object.prototype);
  });

  it('handles constructor.prototype payloads', () => {
    update({}, JSON.parse('{"constructor": {"prototype": {"polluted": true}}}'));
    expectClean();
    const target: Obj = {};
    update(target, JSON.parse('{"a": {"constructor": {"prototype": {"polluted": true}}}}'));
    expectClean();
  });

  it('ignores a __proto__ key inside array elements', () => {
    update({ arr: [{}] }, JSON.parse('{"arr": [{"__proto__": {"polluted": true}}]}'));
    expectClean();
  });

  it('does not read inherited keys from the target', () => {
    const target: Obj = {};
    update(target, { toString: { a: 1 } });
    expect(Object.getPrototypeOf(target)).toBe(Object.prototype);
    expect(Object.prototype.toString).toBeTypeOf('function');
    expect(target.toString).toStrictEqual({ a: 1 });
  });
});

describe('edge cases', () => {
  it('keeps an explicit undefined and removes a missing key in the same call', () => {
    const target: Obj = { a: 'x', b: 'y' };
    update(target, { a: undefined });
    expect(target).toStrictEqual({ a: undefined });
    expect('b' in target).toBe(false);
  });

  it('adds a key whose value is undefined', () => {
    const target: Obj = {};
    update(target, { a: undefined });
    expect(target).toStrictEqual({ a: undefined });
  });

  it('detects {} <-> [] and replaces the container', () => {
    const t1: Obj = { k: {} };
    update(t1, { k: [] });
    expect(Array.isArray(t1.k)).toBe(true);
    const t2: Obj = { k: [] };
    update(t2, { k: {} });
    expect(Array.isArray(t2.k)).toBe(false);
  });

  it('handles sparse arrays', () => {
    const target: Obj = { arr: [1, 2, 3] };
    // eslint-disable-next-line no-sparse-arrays
    update(target, { arr: [1, , 3] });
    expect(1 in target.arr).toBe(false);
    expect(target.arr.length).toBe(3);
  });

  it('handles trailing holes and length-only changes', () => {
    const target: Obj = { arr: [1, 2, 3] };
    const source = { arr: new Array(3) };
    source.arr[0] = 1;
    update(target, source);
    expect(target.arr.length).toBe(3);
    expect(1 in target.arr).toBe(false);
  });

  it('handles nested arrays and keeps inner identity', () => {
    const inner = [1, 2];
    const target: Obj = { grid: [inner, [3]] };
    update(target, { grid: [[1, 2, 9], [3]] });
    expect(target.grid[0]).toBe(inner);
    expect(inner).toStrictEqual([1, 2, 9]);
  });

  it('shrinks and changes elements in one call', () => {
    const arr = [{ a: 1 }, { a: 2 }, { a: 3 }];
    const target: Obj = { arr };
    update(target, { arr: [{ a: 1 }, { a: 20 }] });
    expect(target.arr).toBe(arr);
    expect(arr).toStrictEqual([{ a: 1 }, { a: 20 }]);
  });

  it('replaces non-plain objects by reference when they differ', () => {
    class Foo {
      constructor(public v: number) {}
    }
    const s = new Set([1]);
    const source = { s, f: new Foo(1) };
    const target: Obj = { s: new Set(), f: new Foo(0) };
    update(target, source);
    expect(target.s).toBe(source.s);
    expect(target.f).toBe(source.f);
  });

  it('keeps null-prototype objects null-prototype when inserting', () => {
    const np = Object.assign(Object.create(null), { a: 1 });
    const target: Obj = {};
    update(target, { np });
    expect(Object.getPrototypeOf(target.np)).toBeNull();
    expect(target.np).not.toBe(np);
  });

  it('supports array roots', () => {
    const target = [1, 2, 3];
    update(target, [1, 5]);
    expect(target).toStrictEqual([1, 5]);
  });

  it('is a noop for update(x, x)', () => {
    const target = { a: { b: [1] } };
    const { proxy, writes } = trackWrites(target);
    update(proxy, target);
    expect(writes).toEqual([]);
  });

  it('handles empty source and empty target', () => {
    const t1: Obj = { a: 1, b: { c: 2 } };
    update(t1, {});
    expect(t1).toStrictEqual({});
    const t2: Obj = {};
    update(t2, { a: { b: 1 } });
    expect(t2).toStrictEqual({ a: { b: 1 } });
  });

  it('throws on mismatched or non-object roots', () => {
    expect(() => update([] as any, {})).toThrow(TypeError);
    expect(() => update({}, [] as any)).toThrow(TypeError);
    expect(() => update(null as any, {})).toThrow(TypeError);
    expect(() => update({}, 'x' as any)).toThrow(TypeError);
    expect(() => update(new Map() as any, {})).toThrow(TypeError);
  });

  it('throws on circular references in the source', () => {
    const source: Obj = { a: {} };
    source.a.self = source;
    expect(() => update({}, source)).toThrow(TypeError);
    const arr: any[] = [];
    arr.push(arr);
    expect(() => update({}, { arr })).toThrow(TypeError);
  });

  it('allows the same object to appear twice in the source (not a cycle)', () => {
    const shared = { v: 1 };
    const target: Obj = {};
    update(target, { a: shared, b: shared });
    expect(target).toStrictEqual({ a: { v: 1 }, b: { v: 1 } });
    expect(target.a).not.toBe(target.b);
  });
});
