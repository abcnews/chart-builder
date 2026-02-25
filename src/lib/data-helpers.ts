import type { DSVRowString } from 'd3-dsv';
import type { ColumnDefinitionType } from './types';

/**
 * This is a modified version of the d3 autotype function
 * see: https://github.com/d3/d3-dsv/blob/main/src/autoType.js
 *
 * It will return an infered type or, if the passed column definitions specifies a specific type it will attempt to
 * parse that type for the given column and return `null` if not possible.
 */
export const rowParser =
  <T extends keyof ColumnDataTypeMap1>(columnDefinitions: Record<string, T>) =>
  (row: DSVRowString<string>) => {
    const result: Record<string, ColumnDataTypeMap1[T] | null> = {};
    for (let columnName in row) {
      const specified = columnDefinitions[columnName];
      let input: string | boolean | Date | number | null = row[columnName] ? row[columnName].trim() : '';
      let value: ColumnDataTypeMap1[T] | null = null;
      let number: number;
      let m: RegExpMatchArray | null;

      const dateRegex = new RegExp(
        /^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/
      );

      if (specified) {
        if (specified === 'string') value = input as ColumnDataTypeMap1[T];
        else if (specified === 'boolean') {
          if (input === 'true') value = true as ColumnDataTypeMap1[T];
          else if (input === 'false') value = false as ColumnDataTypeMap1[T];
          else value = null;
        } else if (specified === 'date') {
          if ((m = input.match(dateRegex))) {
            if (fixtz && !!m[4] && !m[7]) input = input.replace(/-/g, '/').replace(/T/, ' ');
            value = new Date(input) as ColumnDataTypeMap1[T];
          } else return null;
        } else if (specified === 'number') {
          if (!isNaN((number = +input))) {
            value = number as ColumnDataTypeMap1[T];
          } else value = null;
        }
      }

      result[columnName] = value;
    }
    return result;
  };

// https://github.com/d3/d3-dsv/issues/45
const fixtz = new Date('2019-01-01T00:00').getHours() || new Date('2019-07-01T00:00').getHours();
