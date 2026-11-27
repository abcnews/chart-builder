<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { LayerCakeGroupedDataType, LayerCakeScalesTypes } from '../../lib/types';
  import { getLayerCakeContext } from 'layercake';
  import { coerceToColumnDataType } from '../../lib/data-helpers';
  import { fadeInOpts, fadeOutOpts } from '../../lib/constants';
  import { getVisState } from '../../lib/context';

  const visState = getVisState();
  const k = getLayerCakeContext<LayerCakeScalesTypes, LayerCakeGroupedDataType>();
  let highlights = $derived(visState.config.highlights.filter(d => !d.deleted));
  let xAxisDataType = $derived(visState.config.axes.x.type);
  let yAxisDataType = $derived(visState.config.axes.y.type);
</script>

{#if xAxisDataType && yAxisDataType}
  {#each highlights as highlight (`${highlight.colour}`)}
    <div
      class="highlight"
      in:fade={fadeInOpts}
      out:fade={fadeOutOpts}
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
