<script lang="ts">
  import { visState } from '../../../lib/state.svelte';
  import { coerceToColumnDataType } from '../../../lib/data-helpers';
  import { getAxisDataType } from '../../../lib/state-accessors';
  import { getLayerCakeContext } from 'layercake';
  import type { LayerCakeGroupedDataType, LayerCakeScalesTypes } from '../../../lib/types';
  import BaseDragHandler from './BaseDragHandler.svelte';

  const k = getLayerCakeContext<LayerCakeScalesTypes, LayerCakeGroupedDataType>();
  let visible = $state(false);
  let highlights = $derived(visState.config.highlights.filter(d => !d.deleted));
  let xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  let yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

<BaseDragHandler
  type="highlight"
  getInitialPos={(index, handle) => {
    const filtered = visState.config.highlights.filter(d => !d.deleted);
    const highlight = filtered[index];
    return handle === 'tl' ? highlight.tl : highlight.br;
  }}
  onMove={(index, handle, x, y) => {
    const filtered = visState.config.highlights.filter(d => !d.deleted);
    const highlgiht = filtered[index];
    if (highlgiht) {
      if (handle === 'tl') {
        highlgiht.tl.x = x;
        highlgiht.tl.y = y;
      } else {
        highlgiht.br.x = x;
        highlgiht.br.y = y;
      }
    }
  }}
/>

{#if xAxisDataType && yAxisDataType}
  <g class="builder-arrow-handles">
    {#each highlights as highlight, i}
      {@const tlX = k.xScale(coerceToColumnDataType(highlight.tl.x, xAxisDataType))}
      {@const tlY = k.yScale(coerceToColumnDataType(highlight.tl.y, yAxisDataType))}
      {@const brX = k.xScale(coerceToColumnDataType(highlight.br.x, xAxisDataType))}
      {@const brY = k.yScale(coerceToColumnDataType(highlight.br.y, yAxisDataType))}
      <circle
        cx={tlX}
        cy={tlY}
        r="8"
        class="handle"
        class:visible
        data-type="highlight"
        data-index={i}
        data-handle="tl"
      />
      <circle
        cx={brX}
        cy={brY}
        r="8"
        class="handle"
        class:visible
        data-type="highlight"
        data-index={i}
        data-handle="to"
      />
    {/each}
  </g>
{/if}

<style>
  .handle {
    fill: AccentColor;
    fill-opacity: 0;
    stroke: AccentColor;
    stroke-width: 1;
    stroke-opacity: 0;
    pointer-events: auto;
    cursor: move;
  }
  .handle.visible {
    fill-opacity: 0.2;
    stroke-opacity: 0.5;
  }
  .handle:hover {
    fill-opacity: 0.5;
    stroke-opacity: 1;
  }
</style>
