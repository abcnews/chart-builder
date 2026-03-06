<script lang="ts">
  import { getContext } from 'svelte';
  import Arrow from '../primatives/Arrow.svg.svelte';
  import type { LayerCakeContextType, ArrowType, DeletableType } from '../../lib/types';
  import { visState } from '../../lib/state.svelte';
  import { getAxisDataType } from '../../lib/data-accessors';
  import { coerceToColumnDataType } from '../../lib/data-helpers';

  interface Props {
    arrows: (ArrowType & DeletableType)[];
  }

  const { xScale, yScale } = getContext<LayerCakeContextType>('LayerCake');

  let { arrows }: Props = $props();
  const arrowsFiltered = $derived(arrows.filter(d => !d.deleted));
  let xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  let yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

<g class="arrows">
  {#each arrowsFiltered as arrow, i}
    {@const fromX = $xScale(coerceToColumnDataType(arrow.from.x, xAxisDataType as any) as any)}
    {@const fromY = $yScale(coerceToColumnDataType(arrow.from.y, yAxisDataType as any) as any)}
    {@const toX = $xScale(coerceToColumnDataType(arrow.to.x, xAxisDataType as any) as any)}
    {@const toY = $yScale(coerceToColumnDataType(arrow.to.y, yAxisDataType as any) as any)}
    <g data-type="arrow" data-index={i}>
      <Arrow lineWidth={1} colour={arrow.colour || 'black'} from={{ x: fromX, y: fromY }} to={{ x: toX, y: toY }} />
    </g>
  {/each}
</g>
