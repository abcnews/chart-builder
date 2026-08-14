<script lang="ts">
  import { visState } from '../../../lib/state.svelte';
  import type { DeletableType, AreaType } from '../../../lib/types';
  import ColourField from './ColourField.svelte';
  import FormActions from './FormActions.svelte';
  import ItemCollectionEditModal from '../ItemCollectionEditModal.svelte';

  interface Props {
    area: (AreaType & DeletableType) | undefined;
  }

  let { area = $bindable() }: Props = $props();

  const seriesIds = $derived(visState.config.series.map(s => s.id));
</script>

{#if area}
  <ItemCollectionEditModal title="Edit Area" onClose={() => (area = undefined)}>
    {#if seriesIds.length < 2}
      <p>Define at least two series before adding an area.</p>
    {:else}
      <label for="area-idA">Series A</label>
      <select id="area-idA" bind:value={area.idA}>
        {#each seriesIds as id}
          <option value={id}>{id}</option>
        {/each}
      </select>

      <label for="area-idB">Series B</label>
      <select id="area-idB" bind:value={area.idB}>
        {#each seriesIds as id}
          <option value={id}>{id}</option>
        {/each}
      </select>

      <ColourField bind:value={area.fill} />

      <label for="area-opacity">Opacity</label>
      <input id="area-opacity" type="range" min="0" max="1" step="0.05" bind:value={area.opacity} />
      <span>{area.opacity}</span>
    {/if}

    {#snippet footer()}
      <FormActions bind:item={area} />
    {/snippet}
  </ItemCollectionEditModal>
{/if}

<style lang="scss">
  input[type='range'] {
    padding: 0; // Remove space from ends of slider
  }
</style>
