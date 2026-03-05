<script lang="ts">
  import { getAxisDataType } from '../../../lib/data-accessors';
  import { visState } from '../../../lib/state.svelte';
  import type { ArrowType, DeletableType } from '../../../lib/types';
  import ChartPositionInput from './ChartPositionInput.svelte';
  import ColourField from './ColourField.svelte';
  import FormActions from './FormActions.svelte';
  import ItemCollectionEditModal from '../ItemCollectionEditModal.svelte';

  interface Props {
    arrow: (ArrowType & DeletableType) | undefined;
  }

  let { arrow = $bindable() }: Props = $props();
  const xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  const yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

{#if arrow}
  <ItemCollectionEditModal title="Edit Arrow" onClose={() => (arrow = undefined)}>
    {#if typeof xAxisDataType === 'undefined' || typeof yAxisDataType === 'undefined'}
      <p>You must add a series before arrows can be positioned.</p>
    {:else}
      <ChartPositionInput
        label="From"
        id="arrow-start"
        bind:value={arrow.from}
        columnTypes={{ x: xAxisDataType, y: yAxisDataType }}
      />
      <ChartPositionInput
        label="To"
        id="arrow-end"
        bind:value={arrow.to}
        columnTypes={{ x: xAxisDataType, y: yAxisDataType }}
      />
      <ColourField bind:value={arrow.colour} defaultValue="#000000" />
    {/if}

    {#snippet footer()}
      <FormActions bind:item={arrow} />
    {/snippet}
  </ItemCollectionEditModal>
{/if}
