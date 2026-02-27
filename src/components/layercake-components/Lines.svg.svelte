<script lang="ts">
  import { getContext } from 'svelte';
  import { line, curveLinear, type CurveFactory } from 'd3-shape';
  import { type LayerCakeContextType, type LayerCakeGroupedDataGroupValuesType } from '../../lib/types';

  interface Props {
    curve?: CurveFactory;
  }
  const { data, xGet, yGet, zGet } = getContext<LayerCakeContextType>('LayerCake');

  let { curve = curveLinear }: Props = $props();
  let lineGenerator = $derived(line<LayerCakeGroupedDataGroupValuesType>($xGet, $yGet).curve(curve));
  const renderedLines = $derived(
    $data.flatMap(({ values, config }) => {
      // Only lines
      if (config.type !== 'line') return [];

      // Remove data where y-axis value is null or undefined.
      // TODO: Add option to split the series for missing data. Or some other missing data display options.
      const vals = values.flatMap(d => {
        if (d.y === undefined || d.y === null) return [];
        return [d];
      });

      // No empty series.
      if (vals.length === 0) return [];

      return [
        {
          id: config.id,
          d: lineGenerator(vals),
          stroke: config.colour || (vals[0] ? $zGet(vals[0]) : '#000')
        }
      ];
    })
  );
</script>

<g class="line-group">
  {#each renderedLines as line (line.id || line)}
    <path class="path-line outline" d={line.d}></path>
    <path class="path-line" d={line.d} stroke={line.stroke}></path>
  {/each}
</g>

<style>
  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2px;
    transition: d 0.5s ease;
    &.outline {
      stroke-width: 3px;
      stroke: #fff;
    }
  }
</style>
