import { describe, expect, it } from 'vitest';
import { update, type Obj } from './surgical-state-updates';

describe('update state', () => {
  it('adds new keys to an object', () => {
    const target: Obj = {};
    const source: Obj = { added: 'property' };
    update(target, source);
    expect(target.added).toBe('property');
    expect(target).toStrictEqual(source);
  });

  it('removes keys from an object', () => {
    const target: Obj = { added: 'property' };
    const source: Obj = {};
    update(target, source);
    expect(target.added).toBeUndefined();
    expect(target).toStrictEqual(source);
  });

  it('removes elements from an array', () => {
    const target: Obj = { arrayKey: ['one'] };
    const source: Obj = { arrayKey: [] };
    update(target, source);
    expect(target).toStrictEqual(source);
  });

  it('removes multiple elements from an array', () => {
    const target: Obj = { arrayKey: ['one', 'two', 'three', 'four'] };
    const source: Obj = { arrayKey: ['two', 'four'] };
    update(target, source);
    expect(target).toStrictEqual(source);
  });

  it('handles deeply nested objects without modifying objects', () => {
    const levelTwo = { levelThree: 'value' };
    const target: Obj = { levelOne: { levelTwo } };
    const source: Obj = { levelOne: { levelTwo: { levelThree: 'new value' } } };
    update(target, source);
    expect(target).toStrictEqual(source);
    expect(target.levelOne.levelTwo).toBe(levelTwo);
  });

  it('modifies array content without modifying the array object', () => {
    const arr = ['one', 'two', 'three'];
    const target: Obj = { levelOne: { arr } };
    const source: Obj = { levelOne: { arr: ['one', 'three'] } };
    update(target, source);
    expect(target).toStrictEqual(source);
    expect(target.levelOne.arr).toBe(arr);
  });

  it('handles undefined values in the source object', () => {
    const target: Obj = { a: 'property' };
    const source: Obj = { a: undefined };
    const toStr = JSON.stringify(source);
    update(target, source);
    const targetStr = JSON.stringify(target);
    expect(target).toStrictEqual(source);
    expect(targetStr).toBe(toStr);
  });

  it('handles null values in the source object', () => {
    const target: Obj = { a: 'property' };
    const source: Obj = { a: null };
    const targetBeforeStr = JSON.stringify(target);
    const toStr = JSON.stringify(source);
    update(target, source);
    const targetStr = JSON.stringify(target);
    expect(target.a).toBeNull();
    expect(target).toStrictEqual(source);
    expect(targetBeforeStr).not.toBe(targetStr);
    expect(toStr).toBe(targetStr);
  });

  it('is idempotent', () => {
    const target: Obj = { arrayKey: ['one', 'two', 'three', 'four'] };
    const source: Obj = { arrayKey: ['two', 'four'] };
    update(target, source);
    expect(target).toStrictEqual(source);
    update(target, source);
    expect(target).toStrictEqual(source);
  });

  it('works when the same source object is reused', () => {
    const source: Obj = { arr: ['two', 'four'] };
    const a: Obj = { arr: ['one', 'two', 'three', 'four'] };
    const b: Obj = { arr: ['one', 'two', 'three', 'four'] };
    update(a, source);
    update(b, source);
    expect(a).toStrictEqual(source);
    expect(b).toStrictEqual(source);
    expect(a).toStrictEqual(b);
  });

  it('replaces a primitive with an object', () => {
    const target: Obj = { a: 'str' };
    const source: Obj = { a: { x: 1 } };
    update(target, source);
    expect(target).toStrictEqual(source);
  });

  it('replaces null with an object', () => {
    const target: Obj = { a: null };
    const source: Obj = { a: { x: 1 } };
    update(target, source);
    expect(target).toStrictEqual(source);
  });

  it('grows arrays in place', () => {
    const arr = ['a'];
    const target: Obj = { arr };
    update(target, { arr: ['a', 'b'] });
    expect(target.arr).toBe(arr);
    expect(arr).toStrictEqual(['a', 'b']);
  });

  it('grows array of objects in place', () => {
    const arr = [{ abc: 'a' }];
    const target: Obj = { arr };
    update(target, { arr: [{ abc: 'a' }, { abc: 'b' }] });
    expect(target.arr).toBe(arr);
    expect(arr).toStrictEqual([{ abc: 'a' }, { abc: 'b' }]);
    expect(target.arr[0]).toBe(arr[0]);
  });

  it('can update array values without changing array length', () => {
    const target = { arr: ['a', 'b', 'c'] };
    const source = { arr: ['x', 'y', 'z'] };
    update(target, source);
    expect(target).toStrictEqual(source);
  });

  it('updates Date values', () => {
    const target: Obj = { d: new Date(0) };
    const source: Obj = { d: new Date(1000) };
    update(target, source);
    expect(target.d.getTime()).toBe(1000);
  });

  it('can update objects nested in arrays without changing array or object identity', () => {
    const arr = [{ abc: 'a' }, { abc: 'b' }];
    const target: Obj = { arr };
    const source = { arr: [{ abc: 'a' }, { abc: 'b', xyz: 'x' }] };
    update(target, source);
    expect(target.arr).toBe(arr);
    expect(target).toStrictEqual(source);
    expect(target.arr[1]).toBe(arr[1]);
  });

  it('can change an object to a primative', () => {
    const target = { obj: { a: 'b' } };
    const source = { obj: 'obj' };
    update(target, source);
    expect(target).toStrictEqual(source);
  });

  it('can add, change and remove keys in a single call', () => {
    const target = { a: 'a', b: 'b', c: 'c' };
    const source = { a: 'z', b: 'b', d: 'd' };
    update(target, source);
    expect(target).toStrictEqual(source);
  });

  it('can handle a noop', () => {
    const target = { a: 'a', b: 'b', c: 'c' };
    const source = { a: 'a', b: 'b', c: 'c' };
    update(target, source);
    expect(target).toStrictEqual(source);
    expect(target).toBe(target);
  });

  it('allows undefined array elements', () => {
    const target = { arr: ['a', 'b', 'c'] };
    const source = { arr: ['a', undefined, 'c'] };
    update(target, source);
    expect(target).toStrictEqual({ arr: ['a', undefined, 'c'] });
  });

  it('will re-order array elements', () => {
    const target = { arr: ['a', 'b', 'c'] };
    const source = { arr: ['a', 'c', 'b'] };
    update(target, source);
    expect(target).toStrictEqual(source);
  });

  it('can replace an object with an array', () => {
    const target = { key: { obj: 'obj' } };
    const source = { key: ['a', 'b', 'c'] };
    update(target, source);
    expect(target).toStrictEqual(source);
  });

  it('can replace an array with an object', () => {
    const target = { key: ['a', 'b', 'c'] };
    const source = { key: { obj: 'obj' } };
    update(target, source);
    expect(target).toStrictEqual(source);
  });
  it('replaces an empty object with an empty array', () => {
    const target = { k: {} };
    update(target, { k: [] });
    expect(target).toStrictEqual({ k: [] });
  });

  // This test is skipped because, even though we want it to pass, there's no clear path to implementation.
  it.skip('maintains object identity with array item removal', () => {
    const target = { arr: [{ a: 'a' }, { b: 'b' }, { c: 'c' }] };
    const source = { arr: [{ a: 'a' }, { c: 'c' }] };
    const c = target.arr[2];
    update(target, source);
    expect(target.arr[1]).toBe(c);
  });

  it('handles the same array instance appearing twice in source', () => {
    const shared = ['x'];
    const target: Obj = { a: ['x', 'y'], b: ['x', 'y'] };
    update(target, { a: shared, b: shared });
    expect(target).toStrictEqual({ a: ['x'], b: ['x'] });
  });

  it('does not pollute Object.prototype', () => {
    const source = JSON.parse('{"__proto__": {"polluted": true}}');
    try {
      update({}, source);
      expect(({} as any).polluted).toBeUndefined();
    } finally {
      delete (Object.prototype as any).polluted;
    }
  });
  it('updates Map contents', () => {
    const target: Obj = { m: new Map([[1, 2]]) };
    const source: Obj = { m: new Map() };
    update(target, source);
    expect(target.m.size).toBe(0);
  });

  it('does not mutate the source', () => {
    const source = { arr: ['two', 'four'], o: { a: 1 } };
    const snapshot = structuredClone(source);
    update({ arr: ['one', 'two', 'three', 'four'], o: { a: 0 } }, source);
    expect(source).toStrictEqual(snapshot);
  });

  it('keeps unchanged siblings by identity', () => {
    const keep = { k: 1 };
    const target: Obj = { keep, change: 'a' };
    update(target, { keep: { k: 1 }, change: 'b' });
    expect(target.keep).toBe(keep);
  });
});
