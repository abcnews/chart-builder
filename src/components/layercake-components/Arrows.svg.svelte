<script lang="ts">
  import Arrow from '../primatives/Arrow.svg.svelte';
  import type { ArrowType, DeletableType, LayerCakeScalesTypes, LayerCakeGroupedDataType } from '../../lib/types';
  import { getLayerCakeContext } from 'layercake';
  import { getAxisDataType } from '../../lib/state-accessors';
  import { visState } from '../../lib/state.svelte';
  import { coerceToColumnDataType } from '../../lib/data-helpers';

  interface Props {
    arrows: (ArrowType & DeletableType)[];
  }

  const k = getLayerCakeContext<LayerCakeScalesTypes, LayerCakeGroupedDataType>();

  let { arrows }: Props = $props();

  let xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  let yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

{#if xAxisDataType && yAxisDataType}
  {#each arrows as arrow}
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
  {/each}
{/if}
