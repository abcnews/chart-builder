<script lang="ts">
  import { visState } from '../../../lib/state.svelte';
  import type { DeletableType, SeriesType } from '../../../lib/types';
  import ColourField from './ColourField.svelte';
  import FormActions from './FormActions.svelte';
  import ItemCollectionEditModal from '../ItemCollectionEditModal.svelte';
  import { curveTypes } from '../../../lib/schemas';

  interface Props {
    series: (SeriesType & DeletableType) | undefined;
    index: number; // The index of this item in its collection
  }

  let { series = $bindable() }: Props = $props();
  let dataset = $derived.by(() => {
    return visState.config.data.find(d => d.name === series?.dataset);
  });
</script>

{#if series}
  <ItemCollectionEditModal title="Edit Series" onClose={() => (series = undefined)}>
    <label for="series-id">ID</label>
    <input id="series-id" type="text" bind:value={series.id} />
    <label for="series-dataset">Dataset</label>
    <select id="series-dataset" bind:value={series.dataset}>
      {#each visState.config.data as dataset}
        <option id={dataset.name}>{dataset.name}</option>
      {/each}
    </select>

    <label for="series-x">x</label>
    <select id="series-x" bind:value={series.x}>
      {#each Object.entries(dataset?.columns || []) as [name, type], i}
        <option value={name}>{name} ({type})</option>
      {/each}
    </select>
    <label for="series-y">y</label>
    <select id="series-y" bind:value={series.y}>
      {#each Object.entries(dataset?.columns || []) as [name, type], i}
        <option value={name}>{name} ({type})</option>
      {/each}
    </select>

    <ColourField bind:value={series.colour} />

    <label for="dasharray">Dash pattern</label>
    <input id="dasharray" type="text" bind:value={series.dasharray} placeholder="Default: none" />

    <label for="series-curve">Curve type</label>
    <select id="series-curve" bind:value={series.curveType}>
      {#each curveTypes as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
    <small>
      See <a href="https://d3js.org/d3-shape/curve" target="_blank">D3 documentation</a> for a deep dive.
    </small>

    {#snippet footer()}
      <FormActions bind:item={series} />
    {/snippet}
  </ItemCollectionEditModal>
{/if}
