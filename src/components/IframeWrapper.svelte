<script>
  import { loadMarkerConfig } from '../lib/state-management';
  import { getDefaultVisState, setVisState } from '../lib/context';
  import Visualisation from './Visualisation.svelte';

  const visState = $state(getDefaultVisState());
  setVisState(visState);
  loadMarkerConfig(document.location.hash.substring(1), visState.config);
</script>

<div>
  <Visualisation />
</div>

<style>
  :global(body, html) {
    margin: 0;
    padding: 0;
  }
  div {
    box-sizing: border-box;
    height: 100dvh;
    width: 100dvw;
  }
</style>
