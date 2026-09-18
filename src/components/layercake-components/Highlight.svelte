<script lang="ts">
  import { visState } from '../../lib/state.svelte';
  import { getLayerCakeContext, Svg } from 'layercake';
  import type { LayerCakeGroupedDataType, LayerCakeScalesTypes } from '../../lib/types';
  import { getAxisDataType } from '../../lib/state-accessors';
  import { coerceToColumnDataType } from '../../lib/data-helpers';

  const k = getLayerCakeContext<LayerCakeScalesTypes, LayerCakeGroupedDataType>();
  let xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  let yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
  const offset = 2;
  const clipPath = $derived.by(() => {
    // Can't render anything if we don't know the axis data types
    if (!(xAxisDataType && yAxisDataType)) {
      return undefined;
    }

    return `M-${offset},-${offset} h${k.width + offset * 2} v${k.height + offset * 2} h-${k.width + offset * 2} Z ${visState.config.highlights
      .filter(h => !h.deleted)
      .map(h => {
        const coords = [
          [
            Math.max(0, k.xScale(coerceToColumnDataType(h.tl.x, xAxisDataType))),
            Math.max(0, k.yScale(coerceToColumnDataType(h.tl.y, yAxisDataType)))
          ],
          [
            Math.min(k.width, k.xScale(coerceToColumnDataType(h.br.x, xAxisDataType))),
            Math.max(0, k.yScale(coerceToColumnDataType(h.tl.y, yAxisDataType)))
          ],
          [
            Math.min(k.width, k.xScale(coerceToColumnDataType(h.br.x, xAxisDataType))),
            Math.min(k.height, k.yScale(coerceToColumnDataType(h.br.y, yAxisDataType)))
          ],
          [
            Math.max(0, k.xScale(coerceToColumnDataType(h.tl.x, xAxisDataType))),
            Math.min(k.height, k.yScale(coerceToColumnDataType(h.br.y, yAxisDataType)))
          ]
        ];
        return `M ${coords.map(d => d.join(',')).join(' ')} Z`;
      })
      .join(' ')}`;
  });
</script>

<Svg>
  {#if visState.config.highlights.length > 0}
    <rect
      class="shroud"
      x={-offset}
      y={-offset}
      width={k.width + offset * 2}
      height={k.height + offset * 2}
      style:clip-path={`path("${clipPath}") view-box`}
      style:clip-rule="evenodd"
    />
  {/if}
</Svg>

<style>
  .shroud {
    fill: rgba(255, 255, 255, 0.6);
    clip-rule: evenodd;
  }
</style>
