<script lang="ts" generics="Item extends DeletableType, Template extends Item">
  import type { DeletableType } from '../../lib/types';
  import type { Snippet } from 'svelte';
  import ItemList from './ItemList.svelte';
  import { Plus } from 'svelte-bootstrap-icons';

  interface Props {
    current: Item | undefined;
    template: Template;
    collection: Item[];
    legend: string;
    itemLabelGetter(item: Item): string;
    EditForm: Snippet<[number]>;
  }

  let {
    legend,
    collection = $bindable(),
    current = $bindable(),
    template,
    itemLabelGetter,
    EditForm
  }: Props = $props();

  const add = () => {
    current = { ...template };
    collection.push(current);
  };
</script>

<fieldset>
  <legend>{legend}</legend>
  <button class="new-item" onclick={add}><Plus /> New</button>
  <ItemList bind:items={collection} edit={item => (current = item)} getLabel={itemLabelGetter} />

  {#if current}
    {@render EditForm(collection.indexOf(current))}
  {/if}
</fieldset>

<style>
  fieldset {
    position: relative;
  }
  .new-item {
    position: absolute;
    top: -2em;
    right: 0.75rem;
  }

  button > :global(*) {
    vertical-align: text-bottom;
  }
</style>
