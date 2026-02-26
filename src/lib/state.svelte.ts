import { parse } from 'valibot';
import { VisualisationStateSchema } from './schemas';
import type { DSVParsedArray } from 'd3-dsv';

const validateState = (data: unknown) => parse(VisualisationStateSchema, data);

export const visState = $state(
  validateState({
    config: {} // Defaults are provided by the validation library
  })
);

export const visData: Record<string, DSVParsedArray<Record<string, string | number | Date | boolean | null>>> = $state(
  {}
);
