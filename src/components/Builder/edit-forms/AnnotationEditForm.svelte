<script lang="ts">
  import { getAxisDataType } from '../../../lib/data-accessors';
  import { visState } from '../../../lib/state.svelte';
  import type { AnnotationType, DeletableType } from '../../../lib/types';
  import AnchorPointSelector from '../AnchorPointSelector.svelte';
  import ChartPositionInput from './ChartPositionInput.svelte';
  import ColourField from './ColourField.svelte';

  import FormActions from './FormActions.svelte';
  import ItemCollectionEditModal from '../ItemCollectionEditModal.svelte';

  interface Props {
    annotation: (AnnotationType & DeletableType) | undefined;
  }

  let { annotation = $bindable() }: Props = $props();

  const xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  const yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

{#if annotation}
  <ItemCollectionEditModal title="Edit Annotation" onClose={() => (annotation = undefined)}>
    <label for="annotation-text">Label</label>
    <input id="annotation-text" type="text" bind:value={annotation.label} />
    {#if xAxisDataType === undefined || yAxisDataType === undefined}
      <p>You must add a series before annotations can be positioned.</p>
    {:else}
      <ChartPositionInput
        label="Position"
        bind:value={annotation}
        id="anchor-position"
        columnTypes={{ x: xAxisDataType, y: yAxisDataType }}
      />
      <span>Anchor position</span>
      <AnchorPointSelector bind:value={annotation.anchor} />
      <label for="label-width">Width</label>
      <input id="label-width" type="number" min="5" max="100" bind:value={annotation.width} />
    {/if}
    <ColourField bind:value={annotation.colour} defaultValue="#00000" />

    {#snippet footer()}
      <FormActions bind:item={annotation} />
    {/snippet}
  </ItemCollectionEditModal>
{/if}
