<script lang="ts">
  import { getContext } from 'svelte';
  import Arrow from '../primatives/Arrow.svg.svelte';
  import type { LayerCakeContextType, ArrowType, DeletableType } from '../../lib/types';

  interface Props {
    arrows: (ArrowType & DeletableType)[];
  }

  const { xScale, yScale } = getContext<LayerCakeContextType>('LayerCake');

  let { arrows }: Props = $props();
</script>

{#each arrows as arrow}
  <Arrow
    lineWidth={1}
    colour={arrow.colour || 'black'}
    from={{ x: $xScale(new Date(arrow.from.x)), y: $yScale(arrow.from.y) }}
    to={{ x: $xScale(new Date(arrow.to.x)), y: $yScale(arrow.to.y) }}
  />
{/each}
