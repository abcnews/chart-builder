<script lang="ts">
  import { visState } from '../../../lib/state.svelte';
  import { coerceToColumnDataType } from '../../../lib/data-helpers';
  import { getAxisDataType } from '../../../lib/state-accessors';
  import { getLayerCakeContext } from 'layercake';
  import type { LayerCakeGroupedDataType, LayerCakeScalesTypes } from '../../../lib/types';
  import BaseDragHandler from './BaseDragHandler.svelte';

  const k = getLayerCakeContext<LayerCakeScalesTypes, LayerCakeGroupedDataType>();
  let visible = $state(false);
  let arrows = $derived(visState.config.arrows.filter(d => !d.deleted));
  let xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  let yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

<BaseDragHandler
  type="arrow"
  getInitialPos={(index, handle) => {
    const filtered = visState.config.arrows.filter(d => !d.deleted);
    const arrow = filtered[index];
    return handle === 'from' ? arrow.from : arrow.to;
  }}
  onMove={(index, handle, x, y) => {
    const filtered = visState.config.arrows.filter(d => !d.deleted);
    const arrow = filtered[index];
    if (arrow) {
      if (handle === 'from') {
        arrow.from.x = x;
        arrow.from.y = y;
      } else {
        arrow.to.x = x;
        arrow.to.y = y;
      }
    }
  }}
/>

{#if xAxisDataType && yAxisDataType}
  <g class="builder-arrow-handles">
    {#each arrows as arrow, i}
      {@const fromX = k.xScale(coerceToColumnDataType(arrow.from.x, xAxisDataType))}
      {@const fromY = k.yScale(coerceToColumnDataType(arrow.from.y, yAxisDataType))}
      {@const toX = k.xScale(coerceToColumnDataType(arrow.to.x, xAxisDataType))}
      {@const toY = k.yScale(coerceToColumnDataType(arrow.to.y, yAxisDataType))}
      <circle
        cx={fromX}
        cy={fromY}
        r="8"
        class="handle"
        class:visible
        data-type="arrow"
        data-index={i}
        data-handle="from"
      />
      <circle cx={toX} cy={toY} r="8" class="handle" class:visible data-type="arrow" data-index={i} data-handle="to" />
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
