<script lang="ts">
  import type { DataSetType, DeletableType } from '../../../lib/types';
  import FormActions from '../form-inputs/FormActions.svelte';
  import ItemCollectionEditModal from '../ItemCollectionEditModal.svelte';
  import { visState } from '../../../lib/state.svelte';

  interface Props {
    dataset: (DataSetType & DeletableType) | undefined;
  }

  let { dataset = $bindable() }: Props = $props();

  let columns = $derived(dataset ? visState.data[dataset?.name]?.columns : undefined);
</script>

{#if dataset}
  <ItemCollectionEditModal title="Edit Dataset" onClose={() => (dataset = undefined)}>
    <div>
      <label for="name">Name</label>
      <input type="text" bind:value={dataset.name} />
    </div>
    <div>
      <label for="name">Download Object Core Media ID or URL</label>
      <input type="text" bind:value={dataset.url} />
    </div>
    {#if columns}
      <fieldset>
        <legend>Column types</legend>
        {#each columns as columnName, i}
          <div>
            <label for="column-name-{i}">{columnName}</label>
            <select bind:value={dataset.columns[columnName]} id="column-name-{i}">
              <option value="string">text</option>
              <option value="boolean">true/false</option>
              <option value="number">number</option>
              <option value="date">date</option>
            </select>
          </div>
        {/each}
      </fieldset>
    {/if}

    {#snippet footer()}
      <FormActions bind:item={dataset} />
    {/snippet}
  </ItemCollectionEditModal>
{/if}
