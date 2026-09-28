import { whenDOMReady } from '@abcnews/env-utils';
import BuilderApp from './components/Builder/BuilderApp.svelte';
import { mount } from 'svelte';
import { proxy } from '@abcnews/dev-proxy';
import { PROJECT_NAME } from './lib/constants';

Promise.all([whenDOMReady, proxy(PROJECT_NAME)]).then(() => {
  const [appMountEl] = document.getElementsByTagName('body');
  if (appMountEl) {
    mount(BuilderApp, {
      target: appMountEl
    });
  } else {
    console.error('appMountEl not found');
  }
});
