import { proxy } from '@abcnews/dev-proxy';
import { PROJECT_NAME } from './lib/constants';
import { mount } from 'svelte';
import IframeWrapper from './components/IframeWrapper.svelte';

Promise.all([proxy(PROJECT_NAME)]).then(() => {

  try {
    mount(IframeWrapper, {
      target: document.body
    });
  } catch (e) {
    const errorMessage = 'Unable to load interactive.';
    console.error(errorMessage, e);
  }
});
