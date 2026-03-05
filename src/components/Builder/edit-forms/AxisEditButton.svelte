<script lang="ts">
  import type { AxisOptionsSchema } from '../../../lib/schemas';
  import type { ColumnTypesType } from '../../../lib/types';
  import { defaultAxisLabelFormatStrings } from '../../../lib/constants';
  import FieldGroup from './FieldGroup.svelte';
  import AxisPositionInput from './AxisPositionInput.svelte';
  import type { InferOutput } from 'valibot';
  import { Arrows, ArrowsVertical } from 'svelte-bootstrap-icons';
  import ItemCollectionEditModal from '../ItemCollectionEditModal.svelte';

  interface Props {
    axis: InferOutput<typeof AxisOptionsSchema>;
    label: string;
    columnType: ColumnTypesType | undefined;
  }

  let { axis = $bindable(), label, columnType }: Props = $props();

  let isEditing = $state(false);
</script>

<button class="axis-edit-button" onclick={() => (isEditing = true)}>
  {#if label === 'X'}
    <Arrows />
  {:else if label === 'Y'}
    <ArrowsVertical />
  {/if}
  {label} Axis ({columnType || 'undefined'})
</button>

{#if isEditing}
  <ItemCollectionEditModal title="Edit {label} Axis" onClose={() => (isEditing = false)}>
    <FieldGroup>
      <label for="{label.toLowerCase()}-axis-ticks">Labels</label>
      <input
        id="{label.toLowerCase()}-axis-ticks"
        type="text"
        bind:value={axis.ticks}
        placeholder="e.g. 1980, 1985, 1990"
      />
      <label for="{label.toLowerCase()}-axis-format">Format</label>
      <input
        id="{label.toLowerCase()}-axis-format"
        type="text"
        bind:value={axis.format}
        placeholder={`Default: ${defaultAxisLabelFormatStrings[columnType || ''] || ''}`}
      />
      {#if label === 'X'}
        <label for="x-axis-baseline">
          <input id="x-axis-baseline" type="checkbox" bind:checked={axis.baseline} />
          Show axis line
        </label>
      {/if}
    </FieldGroup>
    <small>
      Formatting uses d3's formatting functions (<a href="https://d3js.org/d3-format#locale_format">numbers</a>,
      <a href="https://d3js.org/d3-time-format#locale_format">dates</a>).
    </small>

    <hr />

    <FieldGroup label="Chart extent">
      <AxisPositionInput
        label="Min"
        id="{label.toLowerCase()}-axis-domain-min"
        bind:value={axis.domain.min}
        columnType={columnType as ColumnTypesType}
      />
      <AxisPositionInput
        label="Max"
        id="{label.toLowerCase()}-axis-domain-max"
        bind:value={axis.domain.max}
        columnType={columnType as ColumnTypesType}
      />
    </FieldGroup>
  </ItemCollectionEditModal>
{/if}

<style>
  .axis-edit-button {
    display: flex;
    align-items: center;
    gap: 0.5em;
    width: 100%;
    justify-content: flex-start;
    cursor: pointer;
  }
</style>
