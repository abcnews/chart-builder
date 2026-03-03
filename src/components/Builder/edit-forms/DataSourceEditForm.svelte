<script lang="ts">
  import type { DataSourceType, DeletableType } from '../../../lib/types';
  import FormActions from './FormActions.svelte';
  import ItemCollectionEditModal from '../ItemCollectionEditModal.svelte';

  interface Props {
    source: (DataSourceType & DeletableType) | undefined;
  }

  let { source = $bindable() }: Props = $props();
</script>

{#if source}
  <ItemCollectionEditModal title="Edit Data Source" onClose={() => (source = undefined)}>
    <label for="source-label">Label</label>
    <input id="source-label" type="text" bind:value={source.label} />
    <label for="source-url">URL (optional)</label>
    <input id="source-url" type="text" bind:value={source.url} />

    {#snippet footer()}
      <FormActions bind:item={source} />
    {/snippet}
  </ItemCollectionEditModal>
{/if}
