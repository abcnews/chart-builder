<script lang="ts">
  import { visState } from '../../../lib/state.svelte';
  import type { AnnotationType, DeletableType } from '../../../lib/types';
  import AnchorPointSelector from '../AnchorPointSelector.svelte';
  import ChartPositionInput from '../form-inputs/ChartPositionInput.svelte';
  import ColourField from '../form-inputs/ColourField.svelte';

  import FormActions from '../form-inputs/FormActions.svelte';
  import ItemCollectionEditModal from '../ItemCollectionEditModal.svelte';

  interface Props {
    annotation: (AnnotationType & DeletableType) | undefined;
  }

  let { annotation = $bindable() }: Props = $props();
</script>

{#if annotation}
  <ItemCollectionEditModal title="Edit Annotation" onClose={() => (annotation = undefined)}>
    <label for="annotation-text">Label</label>
    <input id="annotation-text" type="text" bind:value={annotation.label} />
    {#if visState.config.axes.x.type === undefined || visState.config.axes.y.type === undefined}
      <p>You must setup the axes before annotations can be positioned.</p>
    {:else}
      <ChartPositionInput
        label="Position"
        bind:value={annotation}
        id="anchor-position"
        types={{ x: visState.config.axes.x.type, y: visState.config.axes.y.type }}
      />
      <span>Anchor position</span>
      <AnchorPointSelector bind:value={annotation.anchor} />
      <label for="label-width">Width</label>
      <input id="label-width" type="number" min="5" max="100" bind:value={annotation.width} />
    {/if}
    <ColourField bind:value={annotation.colour} defaultValue="#00000" />

    {#snippet footer()}
      <FormActions bind:item={annotation} />
    {/snippet}
  </ItemCollectionEditModal>
{/if}
