<script lang="ts">
  import Scrollyteller from '@abcnews/svelte-scrollyteller';
  import Visualisation from './Visualisation.svelte';
  import { loadMarkerConfig } from '../lib/state-management';
  import { getDefaultVisState, setVisState } from '../lib/context';

  const { panels } = $props();
  const visState = $state(getDefaultVisState());

  setVisState(visState);

  let latestConfig: string = '';

  const updateState = (detail: { config: string }) => {
    if (latestConfig !== detail.config) {
      try {
        loadMarkerConfig(detail.config, visState.config);
        latestConfig = detail.config;
      } catch (e) {
        console.error(e, detail);
      }
    }
  };

  $effect(() => {
    if (panels[0].data) updateState(panels[0].data);
  });
</script>

<Scrollyteller
  {panels}
  onMarker={updateState}
  layout={{ align: 'left', mobileVariant: 'rows', resizeInteractive: true }}
>
  <Visualisation />
</Scrollyteller>
