<script lang="ts">
  import type { DataSetType, DeletableType } from '../../../lib/types';
  import FormActions from '../form-inputs/FormActions.svelte';
  import { Loader } from '@abcnews/components-builder';
  import ItemCollectionEditModal from '../ItemCollectionEditModal.svelte';
  import { visState } from '../../../lib/state.svelte';

  interface Props {
    set: (DataSetType & DeletableType) | undefined;
  }

  let { set = $bindable() }: Props = $props();

  let columns = $derived(set ? visState.data[set?.name]?.columns : undefined);
</script>

{#if set}
  <ItemCollectionEditModal title="Edit Dataset" onClose={() => (set = undefined)}>
    <div>
      <label for="name">Name</label>
      <input type="text" bind:value={set.name} />
    </div>
    <div>
      <label for="name">Download Object Core Media ID or URL</label>
      <input type="text" bind:value={set.url} />
    </div>
    {#if columns}
      <fieldset>
        <legend>Column types</legend>
        {#each columns as columnName, i}
          <div>
            <label for="column-name-{i}">{columnName}</label>
            <select bind:value={set.columns[columnName]} id="column-name-{i}">
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
      <FormActions bind:item={set} />
    {/snippet}
  </ItemCollectionEditModal>
{/if}
