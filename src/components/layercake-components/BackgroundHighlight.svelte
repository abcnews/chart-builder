<script lang="ts">
  import { visState } from '../../lib/state.svelte';
  import { fade } from 'svelte/transition';
  import type { LayerCakeGroupedDataType, LayerCakeScalesTypes } from '../../lib/types';
  import { getLayerCakeContext } from 'layercake';
  import { getAxisDataType } from '../../lib/state-accessors';
  import { coerceToColumnDataType } from '../../lib/data-helpers';

  const k = getLayerCakeContext<LayerCakeScalesTypes, LayerCakeGroupedDataType>();
  let xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  let yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

{#if xAxisDataType && yAxisDataType}
  {#each visState.config.highlights.filter(d => !d.deleted) as highlight}
    <div
      class="highlight"
      transition:fade
      style:--highlight-color={highlight.colour && highlight.colour.length > 2 ? highlight.colour : undefined}
      style:left={`${k.xScale(coerceToColumnDataType(highlight.tl.x, xAxisDataType))}px`}
      style:top={`${k.yScale(coerceToColumnDataType(highlight.tl.y, yAxisDataType))}px`}
      style:width={`${
        k.xScale(coerceToColumnDataType(highlight.br.x, xAxisDataType)) -
        k.xScale(coerceToColumnDataType(highlight.tl.x, xAxisDataType))
      }px`}
      style:height={`${
        k.yScale(coerceToColumnDataType(highlight.br.y, yAxisDataType)) -
        k.yScale(coerceToColumnDataType(highlight.tl.y, yAxisDataType))
      }px`}
    ></div>
  {/each}
{/if}

<style>
  .highlight {
    position: absolute;
    background: var(--highlight-color, rgba(0, 0, 0, 0.2));
    border-radius: 4px;
  }
</style>
