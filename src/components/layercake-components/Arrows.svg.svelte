<script lang="ts">
  import Arrow from '../primatives/Arrow.svg.svelte';
  import type { LayerCakeScalesTypes, LayerCakeGroupedDataType } from '../../lib/types';
  import { getLayerCakeContext } from 'layercake';
  import { getAxisDataType } from '../../lib/state-accessors';
  import { visState } from '../../lib/state.svelte';
  import { coerceToColumnDataType } from '../../lib/data-helpers';
  import { fade } from 'svelte/transition';
  import { prefersReducedMotion } from '@abcnews/env-utils';
  import { cubicInOut } from 'svelte/easing';

  const k = getLayerCakeContext<LayerCakeScalesTypes, LayerCakeGroupedDataType>();
  let arrows = $derived(visState.config.arrows.filter(d => !d.deleted));
  let xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  let yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

{#if xAxisDataType && yAxisDataType}
  {#each arrows as arrow (arrow.id || `${arrow.from.x}${arrow.from.y}${arrow.to.x}${arrow.to.y}`)}
    <g transition:fade={{ duration: $prefersReducedMotion ? 0 : 1000, easing: cubicInOut }}>
      <Arrow
        lineWidth={1}
        colour={arrow.colour || 'black'}
        from={{
          x: k.xScale(coerceToColumnDataType(arrow.from.x, xAxisDataType)),
          y: k.yScale(coerceToColumnDataType(arrow.from.y, yAxisDataType))
        }}
        to={{
          x: k.xScale(coerceToColumnDataType(arrow.to.x, xAxisDataType)),
          y: k.yScale(coerceToColumnDataType(arrow.to.y, yAxisDataType))
        }}
      />
    </g>
  {/each}
{/if}
