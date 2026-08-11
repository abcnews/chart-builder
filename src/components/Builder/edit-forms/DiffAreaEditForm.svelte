<script lang="ts">
  import { visState } from '../../../lib/state.svelte';
  import type { DeletableType, DiffAreaType } from '../../../lib/types';
  import ColourField from './ColourField.svelte';
  import FormActions from './FormActions.svelte';
  import ItemCollectionEditModal from '../ItemCollectionEditModal.svelte';

  interface Props {
    diff: (DiffAreaType & DeletableType) | undefined;
  }

  let { diff = $bindable() }: Props = $props();

  const seriesIds = $derived(visState.config.series.map(s => s.id));
</script>

{#if diff}
  <ItemCollectionEditModal title="Edit Diff" onClose={() => (diff = undefined)}>
    {#if seriesIds.length < 2}
      <p>Define at least two series before adding a diff area.</p>
    {:else}
      <label for="diff-idA">Series A</label>
      <select id="diff-idA" bind:value={diff.idA}>
        {#each seriesIds as id}
          <option value={id}>{id}</option>
        {/each}
      </select>

      <label for="diff-idB">Series B</label>
      <select id="diff-idB" bind:value={diff.idB}>
        {#each seriesIds as id}
          <option value={id}>{id}</option>
        {/each}
      </select>

      <ColourField bind:value={diff.fill} />

      <label for="diff-opacity">Opacity</label>
      <input
        id="diff-opacity"
        type="range"
        min="0"
        max="1"
        step="0.05"
        bind:value={diff.opacity}
      />
      <span>{diff.opacity}</span>
    {/if}

    {#snippet footer()}
      <FormActions bind:item={diff} />
    {/snippet}
  </ItemCollectionEditModal>
{/if}