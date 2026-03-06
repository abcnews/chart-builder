<script lang="ts">
  import Arrow from '../primatives/Arrow.svg.svelte';
  import type { ArrowType, DeletableType, LayerCakeScalesTypes, LayerCakeGroupedDataType } from '../../lib/types';
  import { getLayerCakeContext } from 'layercake';
  import { getAxisDataType } from '../../lib/state-accessors';
  import { visState } from '../../lib/state.svelte';
  import { coerceToColumnDataType } from '../../lib/data-helpers';
  import { fade } from 'svelte/transition';

  interface Props {
    arrows: (ArrowType & DeletableType)[];
  }

  const k = getLayerCakeContext<LayerCakeScalesTypes, LayerCakeGroupedDataType>();

  let { arrows }: Props = $props();
  const arrowsFiltered = $derived(arrows.filter(d => !d.deleted));
  let xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  let yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

{#if xAxisDataType && yAxisDataType}
  {#each arrowsFiltered as arrow (`${arrow.from.x}${arrow.from.y}${arrow.to.x}${arrow.to.y}`)}
    <g transition:fade>
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
