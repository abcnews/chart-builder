import type { DSVRowString } from 'd3-dsv';
import type { AxisOptionsType, ColumnDefinitionType, ColumnTypesType, SeriesType } from './types';
import { timeFormat } from 'd3-time-format';
import { format } from 'd3-format';
import { defaultAxisLabelFormatStrings } from './constants';
import { getOrdinalCategoricalPalette } from '@abcnews/palette';
import { TIERS } from '@abcnews/env-utils';

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
  boolean: boolean;
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
  if (columnDataType === 'boolean') return Boolean(value) as ColumnDataTypeMap[T];
  throw new Error('Unsupported data type passed.');
};

const coerceToStringOrNumber = (val: string | number | Date | boolean) => {
  return typeof val === 'string' ? val : +val;
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
  data: (string | number | boolean | Date | null | undefined)[],
  dataType: ColumnTypesType | undefined,
  padding: number = 0.05
) => {
  if (dataType === undefined) {
    return undefined;
  }

  const isDefined = (input: string | number | null | undefined): input is string | number => {
    return !(typeof input === 'undefined' || input === null || (typeof input === 'string' && input.length === 0));
  };

  const [configMin, configMax] = configDefined;
  const hasMin = isDefined(configMin);
  const hasMax = isDefined(configMax);

  // Shortcut if entire domain is defined in config — no need to calculate extents
  if (hasMin && hasMax) return [configMin, configMax];

  // Ensure clean data
  let filtered =
    dataType === 'string'
      ? data.flatMap(d => (d === undefined || d === null ? [] : [String(d)]))
      : data.flatMap(d => (d === undefined || d === null ? [] : [+d]));

  if (filtered.length === 0) return undefined;

  const [autoMin, autoMax] = filtered.reduce(
    ([min, max], d) => {
      return [typeof d < min ? d : min, typeof d > max ? d : max];
    },
    [filtered[0]!, filtered[0]!]
  );

  let [min, max] = [hasMin ? configMin : autoMin, hasMax ? configMax : autoMax];

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

/**
 * Parse a comma-separated string of ticks and coerce them to the axis data type.
 * @param ticksString Comma-separated string of ticks
 * @param dataType Column data type for coercion
 */
export const parseManualTicks = (ticksString: string | undefined, dataType: ColumnTypesType | undefined) => {
  if (!ticksString || !dataType) return undefined;

  const ticks = ticksString
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => coerceToColumnDataType(s, dataType));

  return ticks.length > 0 ? ticks : undefined;
};

export const getDefaultPalette = (series: SeriesType[]) => {
  return getOrdinalCategoricalPalette(Math.min(5, Math.max(2, series.length)));
};

export const fetchDataUrl = async (urlOrId: string) => {
  const { fetchOne } = await import('@abcnews/terminus-fetch');
  // If url is parsable as a CMID, get the URL from Terminus
  if (urlOrId.match(/^[0-9]+$/)) {
    const doc = await fetchOne({
      id: urlOrId,
      type: 'DownloadObject',
      force: window.location.hostname.includes('aus.aunty.abc') ? TIERS.PREVIEW : undefined
    });
    // @ts-expect-error Until terminus-fetch gets better types, this will be an error
    if (doc.downloadURL) urlOrId = doc.downloadURL;
  }
  return await fetch(urlOrId).then(res => res.text());
};
