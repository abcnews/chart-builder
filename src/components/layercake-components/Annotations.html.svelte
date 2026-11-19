<script lang="ts">
  import { fade } from 'svelte/transition';
  import { visState } from '../../lib/state.svelte';
  import Annotation from './Annotation.html.svelte';
  import { fadeInOpts, fadeOutOpts } from '../../lib/constants';

  let annotations = $derived(visState.config.annotations.filter(d => !d.deleted));
  let xAxisDataType = $derived(visState.config.axes.x.type);
  let yAxisDataType = $derived(visState.config.axes.y.type);
</script>

{#if xAxisDataType && yAxisDataType}
  {#each annotations as annotation (annotation.label)}
    <div in:fade={fadeInOpts} out:fade={fadeOutOpts}>
      <Annotation {annotation} />
    </div>
  {/each}
{/if}
