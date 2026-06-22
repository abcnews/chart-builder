import { safeParse } from 'valibot';
import { decode } from '@abcnews/base-36-props';
import { visState } from './state.svelte';
import { VisualisationSchema } from './schemas';
import type { VisualisationType } from './types';
import { diff } from 'deep-object-diff';

const replace = (source: {}, target: {}, key: string) => {
  if (source[key] === undefined) {
    // Arrays need special handling.
    // This is something to do with the way Svelte signals are implemented. If the key is deleted as if it's a regular
    // object svelte attempts to access a non-existent key.
    if (Array.isArray(target) && typeof +key === 'number' && +key === +key) {
      target.splice(+key, 1);
    } else {
      delete target[key];
    }
  } else {
    target[key] = source[key];
  }
};

const apply = (diff: {}, source: {}, target: {}) => {
  for (const key in diff) {
    if (typeof diff[key] === 'object' && typeof target[key] !== 'undefined') {
      apply(diff[key], source[key], target[key]);
    } else {
      replace(source, target, key);
    }
  }
};

export const loadMarkerConfig = (data: string | Record<string, unknown>) => {
  const obj = typeof data === 'string' ? decode(data) : data;

  // TODO: This is where to migrate old schemas if that's needed.

  const result = safeParse(VisualisationSchema, obj);
  if (result.success) {
    apply(diff(visState.config, result.output), result.output, visState.config);
  } else {
    console.error(result.issues);
  }
};

export const getAxisDataType = (config: VisualisationType, axis: 'x' | 'y') => {
  const series = config.series.filter(d => !d.deleted)[0];
  if (!series || !series[axis]) return undefined;
  const dataset = config.data.find(d => d.name === series.dataset);
  if (!dataset) return undefined;
  return dataset.columns[series[axis]];
};
