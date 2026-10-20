<script lang="ts">
  import { visState } from '../../lib/state.svelte';
  import Annotation from './Annotation.html.svelte';

  let annotations = $derived(visState.config.annotations.filter(d => !d.deleted));
  let xAxisDataType = $derived(visState.config.axes.x.type);
  let yAxisDataType = $derived(visState.config.axes.y.type);
</script>

{#if xAxisDataType && yAxisDataType}
  {#each annotations as annotation, i (annotation.label)}
    <Annotation {annotation} />
  {/each}
{/if}
