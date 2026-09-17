import { safeParse } from 'valibot';
import { decode } from '@abcnews/base-36-props';
import { visState } from './state.svelte';
import { VisualisationSchema } from './schemas';
import { diff } from 'deep-object-diff';
import { fetchOne } from '@abcnews/terminus-fetch';
import { TIERS } from '@abcnews/env-utils';
import type { DataSetType } from './types';
import { rowParser } from './data-helpers';
import { csvParse } from 'd3-dsv';

const replace = (source: {} & { __removalCount?: number }, target: {}, key: string) => {
  if (source[key] === undefined) {
    // Arrays need special handling.
    // This is something to do with the way Svelte signals are implemented. If the key is deleted as if it's a regular
    // object svelte attempts to access a non-existent key.
    if (Array.isArray(target) && typeof +key === 'number' && +key === +key) {
      source.__removalCount = source.__removalCount || 0;
      target.splice(+key - source.__removalCount, 1);
      source.__removalCount++;
    } else {
      delete target[key];
    }
  } else {
    target[key] = source[key];
  }
};

const apply = (diff: {}, source: {}, target: {}) => {
  for (const key in diff) {
    if (typeof diff[key] === 'object' && typeof target[key] !== 'undefined') {
      apply(diff[key], source[key], target[key]);
    } else {
      replace(source, target, key);
    }
  }
};

export const loadMarkerConfig = (data: string | Record<string, unknown>) => {
  const obj = typeof data === 'string' ? decode(data) : data;

  // TODO: This is where to migrate old schemas if that's needed.

  const result = safeParse(VisualisationSchema, obj);
  if (result.success) {
    apply(diff(visState.config, result.output), result.output, visState.config);
  } else {
    console.error(result.issues);
  }
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
    // @ts-expect-error Until terminus-fetch gets better types, this will be an error
    if (doc.downloadURL) urlOrId = doc.downloadURL;
  }
  return await fetch(urlOrId).then(res => res.text());
};

export const updateData = (data: DataSetType[]) => {
  data.forEach(async ({ name, url, columns }) => {
    // TODO: It would make sense to cache these locally, but for now rely on HTTP caching
    const raw = await fetchDataUrl(url);
    const parsed = csvParse(raw, rowParser(columns));
    visState.data[name] = {
      id: name,
      name,
      raw,
      columns: parsed.columns,
      rows: parsed
    };
  });
};
