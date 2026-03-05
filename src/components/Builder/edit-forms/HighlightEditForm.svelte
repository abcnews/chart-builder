<script lang="ts">
  import { getAxisDataType } from '../../../lib/data-accessors';
  import { visState } from '../../../lib/state.svelte';
  import type { DeletableType, HighlightType } from '../../../lib/types';
  import ChartPositionInput from './ChartPositionInput.svelte';
  import ColourField from './ColourField.svelte';
  import FormActions from './FormActions.svelte';
  import ItemCollectionEditModal from '../ItemCollectionEditModal.svelte';

  interface Props {
    highlight: (HighlightType & DeletableType) | undefined;
  }

  let { highlight = $bindable() }: Props = $props();
  const xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  const yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

{#if highlight}
  <ItemCollectionEditModal title="Edit Highlight" onClose={() => (highlight = undefined)}>
    {#if !xAxisDataType || !yAxisDataType}
      <p>Define at least one series before adding highlights.</p>
    {:else}
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
      <ColourField bind:value={highlight.colour} />
    {/if}

    {#snippet footer()}
      <FormActions bind:item={highlight} />
    {/snippet}
  </ItemCollectionEditModal>
{/if}
