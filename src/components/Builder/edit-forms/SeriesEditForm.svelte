<script lang="ts">
  import { visState } from '../../../lib/state.svelte';
  import type { DeletableType, SeriesType } from '../../../lib/types';
  import ColourField from '../form-inputs/ColourField.svelte';
  import FormActions from '../form-inputs/FormActions.svelte';
  import ItemCollectionEditModal from '../ItemCollectionEditModal.svelte';
  import { curveTypes } from '../../../lib/curves';

  interface Props {
    series: (SeriesType & DeletableType) | undefined;
  }

  let { series = $bindable() }: Props = $props();
  let dataset = $derived.by(() => {
    return visState.config.data.find(d => d.name === series?.dataset);
  });
</script>

{#if series}
  <ItemCollectionEditModal title="Edit Series" onClose={() => (series = undefined)}>
    <div>
      <label for="series-id">ID</label>
      <input id="series-id" type="text" bind:value={series.id} />
    </div>
    <div>
      <label for="series-dataset">Dataset</label>
      <select id="series-dataset" bind:value={series.dataset}>
        {#each visState.config.data as dataset}
          <option id={dataset.name}>{dataset.name}</option>
        {/each}
      </select>
    </div>
    {#if series.dataset}
      <div>
        <label for="series-x">X-axis values</label>
        <select id="series-x" bind:value={series.x}>
          {#each Object.entries(dataset?.columns || []) as [name, type]}
            {#if visState.data[series.dataset]?.columns.includes(name)}
              <option value={name}>{name} ({type})</option>
            {/if}
          {/each}
        </select>
      </div>
      <div>
        <label for="series-y">Y-axis values</label>
        <select id="series-y" bind:value={series.y}>
          {#each Object.entries(dataset?.columns || []) as [name, type]}
            {#if visState.data[series.dataset]?.columns.includes(name)}
              <option value={name}>{name} ({type})</option>
            {/if}
          {/each}
        </select>
      </div>
    {/if}
    <div>
      <ColourField bind:value={series.colour} />
    </div>
    <div>
      <label for="dasharray">Dash pattern</label>
      <input id="dasharray" type="text" bind:value={series.dasharray} placeholder="4, 4 (Default: none)" />
    </div>
    <div>
      <label for="series-curve">Curve type</label>
      <select id="series-curve" bind:value={series.curveType}>
        {#each curveTypes as type}
          <option value={type}>{type}</option>
        {/each}
      </select>
      <small>
        See <a href="https://d3js.org/d3-shape/curve" target="_blank">D3 documentation</a> for a deep dive.
      </small>
    </div>
    {#snippet footer()}
      <FormActions bind:item={series} />
    {/snippet}
  </ItemCollectionEditModal>
{/if}
