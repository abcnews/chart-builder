<script lang="ts">
  import { getContext } from 'svelte';
  import type { LayerCakeContextType } from '../../lib/types';
  import { visState } from '../../lib/state.svelte';
  import { getAxisDataType } from '../../lib/data-accessors';
  import { coerceToColumnDataType } from '../../lib/data-helpers';

  const { xScale, yScale, custom } = getContext<LayerCakeContextType>('LayerCake');

  let arrows = $derived(visState.config.arrows.filter(d => !d.deleted));
  let xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  let yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

<g class="builder-arrow-handles">
  {#each arrows as arrow, i}
    {@const fromX = $xScale(coerceToColumnDataType(arrow.from.x, xAxisDataType as any) as any)}
    {@const fromY = $yScale(coerceToColumnDataType(arrow.from.y, yAxisDataType as any) as any)}
    {@const toX = $xScale(coerceToColumnDataType(arrow.to.x, xAxisDataType as any) as any)}
    {@const toY = $yScale(coerceToColumnDataType(arrow.to.y, yAxisDataType as any) as any)}

    <circle
      cx={fromX}
      cy={fromY}
      r="8"
      class="handle"
      class:visible={$custom.showConstructionMarks}
      data-type="arrow"
      data-index={i}
      data-handle="from"
    />
    <circle
      cx={toX}
      cy={toY}
      r="8"
      class="handle"
      class:visible={$custom.showConstructionMarks}
      data-type="arrow"
      data-index={i}
      data-handle="to"
    />
  {/each}
</g>

<style>
  .handle {
    fill: AccentColor;
    fill-opacity: 0;
    stroke: AccentColor;
    stroke-width: 1;
    stroke-opacity: 0;
    pointer-events: auto;
    cursor: crosshair;
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
