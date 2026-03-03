import type { DSVRowString } from 'd3-dsv';
import type { AxisOptionsType, ColumnDefinitionType, ColumnTypesType, SeriesType } from './types';
import { timeFormat } from 'd3-time-format';
import { format } from 'd3-format';
import { defaultAxisLabelFormatStrings } from './constants';
import { extent } from 'd3-array';
import { getOrdinalCategoricalPalette } from '@abcnews/palette';

/**
 * This is a modified version of the d3 autotype function
 * see: https://github.com/d3/d3-dsv/blob/main/src/autoType.js
 *
 * It will return an infered type or, if the passed column definitions specifies a specific type it will attempt to
 * parse that type for the given column and return `null` if not possible.
 */
export const rowParser = (columnDefinitions: ColumnDefinitionType) => (row: DSVRowString<string>) => {
  const result: Record<string, string | boolean | Date | number | null> = {};
  for (let columnName in row) {
    const specified = columnDefinitions[columnName];
    let value: string | boolean | Date | number | null | undefined = row[columnName]?.trim();
    let number: number;
    let m: RegExpMatchArray | null;

    const dateRegex = new RegExp(
      /^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/
    );

    if (specified) {
      if (typeof value === 'undefined') value = null;
      else if (specified === 'string') value = value;
      else if (specified === 'boolean') value = value === 'true' ? true : value === 'false' ? (value = false) : null;
      else if (specified === 'date') {
        if ((m = value.match(dateRegex))) {
          if (fixtz && !!m[4] && !m[7]) value = value.replace(/-/g, '/').replace(/T/, ' ');
          value = new Date(value);
        } else value = null;
      } else if (specified === 'number') value = value.length === 0 ? null : !isNaN((number = +value)) ? number : null;
    } else {
      if (!value) value = null;
      else if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (value === 'NaN') value = NaN;
      else if (!isNaN((number = +value))) value = number;
      else if ((m = value.match(dateRegex))) {
        if (fixtz && !!m[4] && !m[7]) value = value.replace(/-/g, '/').replace(/T/, ' ');
        value = new Date(value);
      } else continue;
    }

    result[columnName] = value;
  }
  return result;
};

// https://github.com/d3/d3-dsv/issues/45
const fixtz = new Date('2019-01-01T00:00').getHours() || new Date('2019-07-01T00:00').getHours();

type ColumnDataTypeMap = {
  date: Date;
  number: number;
  string: string;
  boolean: number;
};

/**
 * Convert a value which has been derived from user input in the chart builder (which is only ever string or number) and
 * convert it to a data type compatible with a column from the data.
 * @param value A value taken from config and/or user input
 * @param columnDataType A column data type that defines the coersion to perform
 */
export const coerceToColumnDataType = <T extends keyof ColumnDataTypeMap>(
  value: number | string,
  columnDataType: T
): ColumnDataTypeMap[T] => {
  if (columnDataType === 'date') return new Date(value) as ColumnDataTypeMap[T];
  if (columnDataType === 'number') return Number(value) as ColumnDataTypeMap[T];
  if (columnDataType === 'string') return String(value) as ColumnDataTypeMap[T];
  if (columnDataType === 'boolean') return Number(value) as ColumnDataTypeMap[T];
  throw new Error('Unsupported data type passed.');
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
export const getDomain = (
  axisOptions: AxisOptionsType,
  data: (string | number | boolean | Date | null | undefined)[],
  dataType: ColumnTypesType | undefined,
  padding: number = 0.05
) => {
  if (dataType === undefined) {
    return undefined;
  }

  // Ensure clean data
  let filtered = data.flatMap(d => {
    if (d === undefined) return [];
    if (d === null) return [];
    return [d];
  });

  const isDefined = (input: string | number | null | undefined): input is string | number => {
    return !(typeof input === 'undefined' || input === null || (typeof input === 'string' && input.length === 0));
  };

  const hasMin = isDefined(axisOptions.domain.min);
  const hasMax = isDefined(axisOptions.domain.max);

  let min = hasMin
    ? coerceToColumnDataType(axisOptions.domain.min as string | number, dataType)
    : filtered.reduce((min, val) => (val < min ? val : min), Infinity);
  let max = hasMax
    ? coerceToColumnDataType(axisOptions.domain.max as string | number, dataType)
    : filtered.reduce((max, val) => (val > max ? val : max), -Infinity);

  // Apply default padding if the domain is auto-calculated and numeric.
  if (dataType === 'number') {
    const range = (max as number) - (min as number);
    const padAmount = range * padding;
    if (!hasMin) {
      min = (min as number) - padAmount;
    }
    if (!hasMax) {
      max = (max as number) + padAmount;
    }
  }

  return [min, max];
};

export const getDefaultPalette = (series: SeriesType[]) => {
  return getOrdinalCategoricalPalette(Math.min(5, Math.max(2, series.length)));
};
