import { parse } from 'valibot';
import { VisualisationStateSchema } from './schemas';

const validateState = (data: unknown) => parse(VisualisationStateSchema, data);

export const visState = $state(
  validateState({
    // The configuration object that defines the visualisation state.
    // Defaults are provided by the validation function
    config: {},
    // A state variable to store the raw data from each of the data sources defined in the config. This is loaded in
    // asynchronously and only updated once the data is loaded to avoid the visualisation reverting to a loading state
    // which is what would happen if we used `{#await}`
    // Object key is the name given to the dataset in the builder UI
    data: {}
  })
);
