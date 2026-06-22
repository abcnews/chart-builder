import { parse } from 'valibot';
import { VisualisationStateSchema } from './schemas';

const validateState = (data: unknown) => parse(VisualisationStateSchema, data);

export const visState = $state(
  validateState({
    config: {} // Defaults are provided by the validation function
  })
);
