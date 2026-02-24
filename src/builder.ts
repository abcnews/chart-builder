import { whenDOMReady } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import type { Mount } from '@abcnews/mount-utils';
import BuilderApp from './components/Builder/BuilderApp.svelte';
import { mount } from 'svelte';
import { proxy } from '@abcnews/dev-proxy';
import { MARKER_NAME, PROJECT_NAME } from './lib/constants';

let appMountEl: Mount;

Promise.all([whenDOMReady, proxy(PROJECT_NAME)]).then(() => {
  [appMountEl] = selectMounts(MARKER_NAME);
  if (appMountEl) {
    mount(BuilderApp, {
      target: appMountEl
    });
  }
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[${PROJECT_NAME}] public path: ${__webpack_public_path__}`);
}
