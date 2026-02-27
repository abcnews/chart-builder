<script lang="ts">
  import Scrollyteller from '@abcnews/svelte-scrollyteller';
  import Visualisation from './Visualisation.svelte';

  import { loadMarkerConfig } from '../lib/data-accessors';

  let latestConfig: string = '';

  const updateState = (detail: { config: string }) => {
    if (latestConfig !== detail.config) {
      try {
        loadMarkerConfig(detail.config);
        latestConfig = detail.config;
      } catch (e) {
        console.error(e, detail);
      }
    }
  };

  let { panels } = $props();
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

<style>
  @media (max-width: 62rem) {
    :global(.viz) {
      transform: translateY(-20px) !important;
      max-height: calc(42dvh + 50px) !important;
    }
  }
  :global(body) {
    overflow: initial !important;
  }
</style>
