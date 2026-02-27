import { safeParse } from 'valibot';
import { decode } from '@abcnews/base-36-props';
import { visState } from './state.svelte';
import { VisualisationSchema } from './schemas';
import type { VisualisationType } from './types';
import { diff } from 'deep-object-diff';

export const loadMarkerConfig = (data: string | Record<string, unknown>) => {
  const obj = typeof data === 'string' ? decode(data) : data;

  // TODO: This is where to migrate old schemas if that's needed.

  const apply = (diff: {}, source: {}, target: {}, path: string[] = []) => {
    for (const key in diff) {
      const replace = () => {
        console.log('path :>> ', [...path, key]);
        if (source[key] === undefined) {
          console.log(`Deleted "${typeof target[key] === 'object' ? JSON.stringify(target[key]) : target[key]}"`);
          delete target[key];
        } else {
          console.log(
            `Replaced "${target[key]}" with "${
              typeof source[key] === 'object' ? JSON.stringify(source[key]) : source[key]
            }"`
          );
          target[key] = source[key];
        }
      };
      if (typeof diff[key] === 'object') {
        if (target[key] !== undefined) {
          apply(diff[key], source[key], target[key], [...path, key]);
        } else {
          replace();
        }
      } else {
        replace();
      }
    }
  };

  const result = safeParse(VisualisationSchema, obj);
  if (result.success) {
    const configDiff = diff(visState.config, result.output);
    console.log('configDiff :>> ', configDiff);
    apply(configDiff, result.output, visState.config);
    // visState.config = result.output;
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
