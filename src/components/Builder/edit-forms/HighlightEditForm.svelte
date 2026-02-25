<script lang="ts">
  import { getAxisDataType } from '../../../lib/data-accessors';
  import { visState } from '../../../lib/state.svelte';
  import type { DeletableType, HighlightType } from '../../../lib/types';
  import ChartPositionInput from './ChartPositionInput.svelte';
  import FormActions from './FormActions.svelte';

  interface Props {
    highlight: (HighlightType & DeletableType) | undefined;
  }

  let { highlight = $bindable() }: Props = $props();
  const xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  const yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

{#if highlight}
  {#if !xAxisDataType || !yAxisDataType}{:else}
    <ChartPositionInput
      id="highlight-top-left"
      label="Top left"
      bind:value={highlight.tl}
      columnTypes={{ x: xAxisDataType, y: yAxisDataType }}
    />
    <ChartPositionInput
      id="highlight-bottom-right"
      label="Bottom right"
      bind:value={highlight.br}
      columnTypes={{ x: xAxisDataType, y: yAxisDataType }}
    />
  {/if}

  <FormActions bind:item={highlight} />
{/if}
