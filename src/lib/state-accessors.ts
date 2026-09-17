/**
 * Accessors for various derived state data.
 * These functions should take any state required to derive the new value as an arguement.
 */

import { timeFormat } from 'd3-time-format';
import type {
  AxisOptionsType,
  ColumnDataTypes,
  ColumnTypesType,
  LayerCakeGroupedDataGroupValuesType,
  LayerCakeGroupedDataType,
  SeriesType,
  VisualisationStateType,
  VisualisationType
} from './types';
import { defaultAxisLabelFormatStrings } from './constants';
import { format } from 'd3-format';
import { coerceToColumnDataType } from './data-helpers';
import { getOrdinalCategoricalPalette } from '@abcnews/palette';

/**
 * The axis data types are defined by the first series defined for the chart and the dataset and column specified for
 * that series.
 *
 * TODO: This has it backward. Refactor so the axes define a data type and ensure columns available when defining a
 * series conform to that type.
 */
export const getAxisDataType = (config: VisualisationType, axis: 'x' | 'y') => {
  // Find the first series
  const series = config.series.filter(d => !d.deleted)[0];

  // If there are no series, we don't know the axis data type
  if (!series || !series[axis]) return undefined;

  // Find the dataset associated with the first series
  const dataset = config.data.find(d => d.name === series.dataset);

  // If there's no dataset, we don't konw the axis data type
  if (!dataset) return undefined;

  const type = dataset.columns[series[axis]];

  // Return undefined if the specified column has a type that's incompatible with an axis.
  if (type !== 'date' && type !== 'number') return undefined;

  // Return the column data type for the dataset column specified for the first series
  return type;
};

export const getAxisLabelFormatter = (axisOptions: AxisOptionsType, axisDataType: ColumnTypesType) => {
  if (axisDataType === 'date') {
    const formatter = timeFormat(axisOptions.format || defaultAxisLabelFormatStrings.date);
    return formatter;
  }
  if (axisDataType === 'number') {
    try {
      return format(axisOptions.format || defaultAxisLabelFormatStrings.number);
    } catch (e) {
      return format(defaultAxisLabelFormatStrings.number);
    }
  }

  // Default to returning coercing to a string for anything else
  return (d: any) => String(d);
};

/**
 * LayerCake expects domain arguments to be either number[] or string[] (which translates into either a d3 scale (either linear or
 * ordinal). d3's linear scales transform the domain into numbers.
 *
 * @param axisOptions Axis options defined in the builder
 * @param data Data to calculate the domain from
 * @param dataType Expected datatype for elements in the data array (as per config defined in builder)
 * @param padding
 */
export const getDomain = (
  configDefined: [min: number | string | null | undefined, max: number | string | null | undefined],
  data: (ColumnDataTypes | null | undefined)[],
  dataType: ColumnTypesType | undefined,
  padding: number = 0.05
): undefined | string[] | number[] => {
  if (dataType === undefined) {
    return undefined;
  }

  const isDefined = (input: string | number | Date | boolean | null | undefined): input is string | number => {
    return !(typeof input === 'undefined' || input === null || (typeof input === 'string' && input.length === 0));
  };

  const [configMin, configMax] = configDefined.map(d => {
    if (d === null || typeof d === 'undefined' || d === '') return null;
    return coerceToColumnDataType(d, dataType);
  });
  const hasMin = isDefined(configMin);
  const hasMax = isDefined(configMax);

  // Shortcut if entire domain is defined in config — no need to calculate extents
  if (hasMin && hasMax) {
    return dataType === 'string'
      ? [String(configMin), String(configMax)]
      : [+coerceToColumnDataType(configMin, dataType), +coerceToColumnDataType(configMax, dataType)];
  }

  // Ensure clean data
  let filtered =
    dataType === 'string'
      ? data.flatMap(d => (d === undefined || d === null ? [] : [String(d)]))
      : data.flatMap(d => (d === undefined || d === null || d === '' ? [] : [+d]));

  if (filtered.length === 0) return undefined;

  const [autoMin, autoMax] = filtered.reduce(
    ([min, max], d) => {
      return [d < min ? d : min, d > max ? d : max];
    },
    [filtered[0]!, filtered[0]!]
  );

  if (dataType === 'string') {
    return [String(hasMin ? configMin : autoMin), String(hasMax ? configMax : autoMax)];
  }

  let [min, max] = [+(hasMin ? configMin : autoMin), +(hasMax ? configMax : autoMax)];

  // Apply default padding if the domain is auto-calculated and numeric.
  const padAmount = (max - min) * padding;
  if (!hasMin) {
    min = min - padAmount;
  }
  if (!hasMax) {
    max = max + padAmount;
  }

  return [min, max];
};

export const getDefaultPalette = (series: SeriesType[]) => {
  return getOrdinalCategoricalPalette(Math.min(5, Math.max(2, series.length)));
};

const getSeriesWithData = (state: VisualisationStateType) => {
  return state.config.series.flatMap(series => {
    if (series.deleted) return [];

    // Try to find the dataset for this series
    const dataset = state.config.data.find(data => data.name === series.dataset);

    // If dataset for this series is undefined, exclude it.
    if (typeof dataset === 'undefined') return [];

    // Try to find the parsed data associated with this series
    const data = state.data[dataset.name];

    // If the data doesn't exist for this series, exclude it.
    if (typeof data === 'undefined') return [];

    return [{ config: series, columns: dataset.columns, data }];
  });
};

export const getFlatData = (state: VisualisationStateType): LayerCakeGroupedDataGroupValuesType[] => {
  return getSeriesWithData(state).flatMap(({ config, data }) => {
    const { x, y, id } = config;
    if (typeof x === 'undefined' || typeof y === 'undefined') {
      console.warn(`Missing x or y column for series ${id}`);
      return [];
    }
    return data.rows.map(d => {
      return { x: d[x], y: d[y], z: id, row: d };
    });
  });
};

export const getGroupedData = (state: VisualisationStateType): LayerCakeGroupedDataType => {
  const data = getSeriesWithData(state).flatMap(({ config, data }) => {
    const { x, y, id } = config;
    if (typeof x === 'undefined' || typeof y === 'undefined') {
      console.warn(`Missing x or y column for series ${config.id}`);
      return [];
    }
    return [
      {
        group: config.id,
        values: data.rows.map(d => ({ x: d[x], y: d[y], z: id, row: d })),
        config: config
      }
    ];
  });
  return data;
};
