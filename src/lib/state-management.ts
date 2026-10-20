import { safeParse } from 'valibot';
import { decode } from '@abcnews/base-36-props';
import { visState } from './state.svelte';
import { VisualisationSchema } from './schemas';
import { fetchOne } from '@abcnews/terminus-fetch';
import { TIERS } from '@abcnews/env-utils';
import type { DataSetType, VisualisationType } from './types';
import { inferColumnDataType, rowParser } from './data-helpers';
import { csvParse } from 'd3-dsv';
import { update } from './surgical-state-updates';

/**
 * The axis data types used to be defined by the first series defined for the chart and the dataset and column specified for
 * that series. This allows us to continue doing that for old configs.
 */
const inferAxisDataTypeFromFirstSeries = (config: VisualisationType, axis: 'x' | 'y') => {
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

export const loadMarkerConfig = (data: string | Record<string, unknown>) => {
  const obj = typeof data === 'string' ? decode(data) : data;

  // TODO: This is where to migrate old schemas if that's needed.

  const result = safeParse(VisualisationSchema, obj);
  if (result.success) {
    // Previously we inferred axis data types from the first defined series. This made a few things more complicated
    // than necessary, so now the axes are defined (including data types) specifically.
    // This takes care of old configs. Where there is a series defined but no axis data type, we infer it on load.
    result.output.axes.x.type = result.output.axes.x.type || inferAxisDataTypeFromFirstSeries(result.output, 'x');
    result.output.axes.y.type = result.output.axes.y.type || inferAxisDataTypeFromFirstSeries(result.output, 'y');

    update(visState.config, result.output);
  } else {
    console.error(result.issues);
  }
};

const isErrorResponse = (obj: any) => {
  return obj.code && obj.error;
};

export const fetchDataUrl = async (urlOrId: string) => {
  // If url is parsable as a CMID, get the URL from Terminus
  if (urlOrId.match(/^[0-9]+$/)) {
    const doc = await fetchOne({
      id: urlOrId,
      type: 'DownloadObject',
      force:
        window.location.hostname.includes('aus.aunty.abc') ||
        (window.location.pathname.includes('/news-projects/') && !window.location.pathname.includes('/iframe'))
          ? TIERS.PREVIEW
          : undefined
    });

    if (isErrorResponse(doc)) {
      return undefined;
    }

    // @ts-expect-error Until terminus-fetch gets better types, this will be an error
    if (doc.downloadURL && doc.docType === 'DownloadObject') urlOrId = doc.downloadURL;
  }

  // Is it parsable as a URL and fetched successfully?
  try {
    return await fetch(new URL(urlOrId)).then(res => {
      return res.ok ? res.text() : undefined;
    });
  } catch (e) {}
};

export const updateData = (data: DataSetType[]) => {
  data.forEach(async ({ name, url, columns }) => {
    if (!url) return;

    const raw = await fetchDataUrl(url);

    if (raw === undefined) return;

    const parsed = csvParse(raw, rowParser(columns));

    // Set column data type based on returned and parsed data (if it's not already set)
    for (let column of parsed.columns) {
      const data = parsed[0]?.[column];
      if (columns[column] === undefined) {
        columns[column] = inferColumnDataType(data);
      }
    }

    // Save the data to state
    visState.data[name] = {
      id: name,
      name,
      raw,
      columns: parsed.columns,
      rows: parsed
    };
  });
};
