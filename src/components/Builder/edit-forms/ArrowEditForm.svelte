<script lang="ts">
  import { visState } from '../../../lib/state.svelte';
  import type { ArrowType, DeletableType } from '../../../lib/types';
  import ChartPositionInput from '../form-inputs/ChartPositionInput.svelte';
  import ColourField from '../form-inputs/ColourField.svelte';
  import FormActions from '../form-inputs/FormActions.svelte';
  import ItemCollectionEditModal from '../ItemCollectionEditModal.svelte';

  interface Props {
    arrow: (ArrowType & DeletableType) | undefined;
  }

  let { arrow = $bindable() }: Props = $props();
  const xAxisDataType = $derived(visState.config.axes.x.type);
  const yAxisDataType = $derived(visState.config.axes.y.type);
</script>

{#if arrow}
  <ItemCollectionEditModal title="Edit Arrow" onClose={() => (arrow = undefined)}>
    {#if typeof xAxisDataType === 'undefined' || typeof yAxisDataType === 'undefined'}
      <p>You must add a series before arrows can be positioned.</p>
    {:else}
      <div>
        <ChartPositionInput
          label="From"
          id="arrow-start"
          bind:value={arrow.from}
          types={{ x: xAxisDataType, y: yAxisDataType }}
        />
      </div>
      <div>
        <ChartPositionInput
          label="To"
          id="arrow-end"
          bind:value={arrow.to}
          types={{ x: xAxisDataType, y: yAxisDataType }}
        />
      </div>
      <div>
        <ColourField bind:value={arrow.colour} defaultValue="#000000" />
      </div>
    {/if}

    {#snippet footer()}
      <FormActions bind:item={arrow} />
    {/snippet}
  </ItemCollectionEditModal>
{/if}
