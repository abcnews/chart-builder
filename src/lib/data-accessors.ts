import { safeParse } from 'valibot';
import { decode } from '@abcnews/base-36-props';
import { visState } from './state.svelte';
import { VisualisationSchema } from './schemas';
import type { VisualisationType } from './types';

export const loadMarkerConfig = (data: string | Record<string, unknown>) => {
  const obj = typeof data === 'string' ? decode(data) : data;

  // TODO: This is where to migrate old schemas if that's needed.

  const result = safeParse(VisualisationSchema, obj);
  if (result.success) {
    visState.config = result.output;
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
