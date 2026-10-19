<script lang="ts">
  import { visState } from '../../../lib/state.svelte';
  import type { DeletableType, HighlightType } from '../../../lib/types';
  import ChartPositionInput from '../form-inputs/ChartPositionInput.svelte';
  import ColourField from '../form-inputs/ColourField.svelte';
  import FormActions from '../form-inputs/FormActions.svelte';
  import ItemCollectionEditModal from '../ItemCollectionEditModal.svelte';

  interface Props {
    highlight: (HighlightType & DeletableType) | undefined;
  }

  let { highlight = $bindable() }: Props = $props();
  const xAxisDataType = $derived(visState.config.axes.x.type);
  const yAxisDataType = $derived(visState.config.axes.y.type);
</script>

{#if highlight}
  <ItemCollectionEditModal title="Edit Highlight" onClose={() => (highlight = undefined)}>
    {#if !xAxisDataType || !yAxisDataType}
      <p>Define at least one series before adding highlights.</p>
    {:else}
      <div>
        <ChartPositionInput
          id="highlight-top-left"
          label="Top left"
          bind:value={highlight.tl}
          types={{ x: xAxisDataType, y: yAxisDataType }}
        />
      </div>
      <div>
        <ChartPositionInput
          id="highlight-bottom-right"
          label="Bottom right"
          bind:value={highlight.br}
          types={{ x: xAxisDataType, y: yAxisDataType }}
        />
      </div>
      <div>
        <ColourField bind:value={highlight.colour} />
      </div>
    {/if}

    {#snippet footer()}
      <FormActions bind:item={highlight} />
    {/snippet}
  </ItemCollectionEditModal>
{/if}
