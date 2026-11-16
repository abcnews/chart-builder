<script lang="ts">
  import { fade } from 'svelte/transition';
  import { visState } from '../../lib/state.svelte';
  import Annotation from './Annotation.html.svelte';
  import { prefersReducedMotion } from '@abcnews/env-utils';
  import { cubicInOut } from 'svelte/easing';

  let annotations = $derived(visState.config.annotations.filter(d => !d.deleted));
  let xAxisDataType = $derived(visState.config.axes.x.type);
  let yAxisDataType = $derived(visState.config.axes.y.type);
</script>

{#if xAxisDataType && yAxisDataType}
  {#each annotations as annotation, i (annotation.label)}
    <div transition:fade={{ duration: $prefersReducedMotion ? 0 : 1000, easing: cubicInOut }}>
      <Annotation {annotation} />
    </div>
  {/each}
{/if}
