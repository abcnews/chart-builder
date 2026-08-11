<script lang="ts">
  import { getContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import { line, curveCardinal, type CurveFactory } from 'd3-shape';
  import { type LayerCakeContextType, type LayerCakeGroupedDataGroupValuesType } from '../../lib/types';
  import { curveMap } from '../../lib/curves';

  interface Props {
    curve?: CurveFactory;
  }
  const { data, xGet, yGet, zGet } = getContext<LayerCakeContextType>('LayerCake');

  let { curve }: Props = $props();

  const renderedLines = $derived.by(() => {
    const result = $data
      .flatMap(({ values, config }) => {
        // Only lines
        if (config.type !== 'line') return [];

        // Remove data where y-axis value is null or undefined.
        const vals = values.flatMap(d => {
          if (d.y === undefined || d.y === null) return [];
          return [d];
        });

        // No empty series.
        if (vals.length === 0) return [];

        return [
          {
            id: config.id,
            d: line<LayerCakeGroupedDataGroupValuesType>($xGet, $yGet).curve(
              curve || (config.curveType && curveMap[config.curveType]) || curveCardinal
            )(vals),
            stroke: config.colour || (vals[0] ? $zGet(vals[0]) : '#000'),
            dasharray: config.dasharray
          }
        ];
      })
      .sort((a, b) => a.id.localeCompare(b.id));

    // Bandaid fix for split-second duplicate ids
    // TODO: Fix this properly in the data diffing (data-accessors.ts probably)
    const deduped = Array.from(new Map(result.map(line => [line.id, line])).values());

    return deduped;
  });
</script>

<g class="line-group">
  {#each renderedLines as line (line.id || line)}
    <g class="line" style:--line-dasharray={line.dasharray ? line.dasharray : undefined} transition:fade>
      <path class="path-line outline" d={line.d}></path>
      <path class="path-line" d={line.d} stroke={line.stroke}></path>
    </g>
  {/each}
</g>

<style>
  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: butt;
    stroke-width: 3px;
    stroke-dasharray: var(--line-dasharray, none);

    &.outline {
      stroke-width: 3px;
      stroke: transparent;
    }
  }
</style>
