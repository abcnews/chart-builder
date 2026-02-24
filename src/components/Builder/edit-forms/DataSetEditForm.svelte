<script lang="ts">
  import type { DataSetType, DeletableType } from '../../../lib/types';
  import { csvParse } from 'd3-dsv';
  import FormActions from './FormActions.svelte';
  import { Loader } from '@abcnews/components-builder';

  interface Props {
    set: (DataSetType & DeletableType) | undefined;
  }

  let { set = $bindable() }: Props = $props();

  let columns = $derived.by(async () => {
    if (set?.url) {
      const raw = await fetch(set.url).then(res => res.text());
      const csv = csvParse(raw);
      return csv.columns;
    }
  });
</script>

{#if set}
  <label for="name">Name</label>
  <input type="text" bind:value={set.name} />
  <label for="name">URL</label>
  <input type="text" bind:value={set.url} />
  {#if set.url}
    <fieldset>
      <legend>Column types</legend>
      {#await columns}
        <Loader />
      {:then columns}
        {#if columns}
          {#each columns as columnName, i}
            <label for="column-name-{i}">{columnName}</label>
            <select bind:value={set.columns[columnName]} id="column-name-{i}">
              <option value="string">text</option>
              <option value="boolean">true/false</option>
              <option value="number">number</option>
              <option value="date">date</option>
            </select>
          {/each}
        {/if}
      {/await}
    </fieldset>
  {/if}
  <FormActions bind:item={set} />
{/if}
