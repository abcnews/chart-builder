<script lang="ts">
  import { getAxisDataType } from '../../../lib/data-accessors';
  import { visState } from '../../../lib/state.svelte';
  import type { ArrowType, DeletableType } from '../../../lib/types';
  import ChartPositionInput from './ChartPositionInput.svelte';
  import ColourField from './ColourField.svelte';
  import FormActions from './FormActions.svelte';

  interface Props {
    arrow: ArrowType & DeletableType;
  }

  let { arrow = $bindable() }: Props = $props();
  const xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  const yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

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
<FormActions bind:item={arrow} />
