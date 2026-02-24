import type { DSVRowString } from 'd3-dsv';
import type { ColumnDefinitionType } from './types';

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
    let value: string | boolean | Date | number | null = row[columnName].trim();
    let number: number;
    let m: RegExpMatchArray | null;

    const dateRegex = new RegExp(
      /^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/
    );

    if (specified) {
      if (specified === 'string') value = value;
      else if (specified === 'boolean') value = value === 'true' ? true : value === 'false' ? (value = false) : null;
      else if (specified === 'date') {
        if ((m = value.match(dateRegex))) {
          if (fixtz && !!m[4] && !m[7]) value = value.replace(/-/g, '/').replace(/T/, ' ');
          value = new Date(value);
        } else return null;
      } else if (specified === 'number') value = !isNaN((number = +value)) ? number : null;
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
