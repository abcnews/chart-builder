<script lang="ts">
  import { visState } from '../../../lib/state.svelte';
  import type { DeletableType, SeriesType } from '../../../lib/types';
  import FormActions from './FormActions.svelte';

  interface Props {
    series: (SeriesType & DeletableType) | undefined;
  }

  let { series = $bindable() }: Props = $props();

  let dataset = $derived(visState.config.data.find(d => d.name === series?.dataset));
</script>

{#if series}
  <label for="series-id">ID</label>
  <input id="series-id" type="text" bind:value={series.id} />
  <label for="series-dataset">Dataset</label>
  <select id="series-dataset" bind:value={series.dataset}>
    {#each visState.config.data as dataset}
      <option id={dataset.name}>{dataset.name}</option>
    {/each}
  </select>
  {#if dataset}
    <label for="series-x">x</label>
    <select id="series-x" bind:value={series.x}>
      {#each Object.entries(dataset.columns) as [name, type], i}
        <option value={name}>{name} ({type})</option>
      {/each}
    </select>
    <label for="series-y">y</label>
    <select id="series-y" bind:value={series.y}>
      {#each Object.entries(dataset.columns) as [name, type], i}
        <option value={name}>{name} ({type})</option>
      {/each}
    </select>
  {/if}
  <FormActions bind:item={series} />
{/if}
