<script lang="ts">
  import { getContext } from 'svelte';
  import { visState } from '../../lib/state.svelte';
  import { fade } from 'svelte/transition';
  import type { LayerCakeContextType } from '../../lib/types';

  const { xScale, yScale } = getContext<LayerCakeContextType>('LayerCake');
</script>

{#each visState.config.highlights.filter(d => !d.deleted) as highlight}
  <div
    class="highlight"
    transition:fade
    style:--highlight-color={highlight.colour && highlight.colour.length > 2 ? highlight.colour : undefined}
    style:left={`${$xScale(new Date(highlight.tl.x))}px`}
    style:top={`${$yScale(highlight.tl.y)}px`}
    style:width={`${$xScale(new Date(highlight.br.x)) - $xScale(new Date(highlight.tl.x))}px`}
    style:height={`${$yScale(highlight.br.y) - $yScale(highlight.tl.y)}px`}
  ></div>
{/each}

<style>
  .highlight {
    position: absolute;
    background: var(--highlight-color, rgba(0, 0, 0, 0.2));
    border-radius: 4px;
  }
</style>
