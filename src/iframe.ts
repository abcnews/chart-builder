import { proxy } from '@abcnews/dev-proxy';
import { PROJECT_NAME } from './lib/constants';
import { loadMarkerConfig } from './lib/state-management';
import { mount } from 'svelte';
import IframeWrapper from './components/IframeWrapper.svelte';

Promise.all([proxy(PROJECT_NAME)]).then(() => {
  loadMarkerConfig(document.location.hash.substring(1));

  try {
    mount(IframeWrapper, {
      target: document.body
    });
  } catch (e) {
    const errorMessage = 'Unable to load interactive.';
    console.error(errorMessage, e);
  }
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[${PROJECT_NAME}] public path: ${__webpack_public_path__}`);
}
