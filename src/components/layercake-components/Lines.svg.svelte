<script lang="ts">
  import { getContext } from 'svelte';
  import { line, curveLinear, type CurveFactory } from 'd3-shape';
  import {
    type LayerCakeContextType,
    type LayerCakeGroupedDataGroupValuesType,
    type SeriesLineType
  } from '../../lib/types';

  interface Props {
    lines: SeriesLineType[];
    curve?: CurveFactory;
  }
  const { data, xGet, yGet, zGet } = getContext<LayerCakeContextType>('LayerCake');

  const getSeries = (name: string) => {
    const series = $data.find(d => {
      return d.group === name;
    });
    return series;
  };

  let { curve = curveLinear, lines }: Props = $props();
  let lineGenerator = $derived(line<LayerCakeGroupedDataGroupValuesType>($xGet, $yGet).curve(curve));
  const renderedLines = $derived(
    lines.flatMap(line => {
      const series = getSeries(line.id);
      if (!series) return [];
      return [
        {
          id: line.id,
          d: lineGenerator(series.values),
          stroke: $zGet(series.values[0])
        }
      ];
    })
  );
</script>

<g class="line-group">
  {#each renderedLines as line (line.id || line)}
    <path class="path-line" d={line.d} stroke={line.stroke}></path>
  {/each}
</g>

<style>
  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 3px;
    transition: d 0.5s ease;
  }
</style>
