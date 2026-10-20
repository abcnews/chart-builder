<script lang="ts">
  import { line, curveCardinal, type CurveFactory } from 'd3-shape';
  import { type LayerCakeGroupedDataType, type LayerCakeScalesTypes } from '../../lib/types';
  import { curveMap } from '../../lib/curves';
  import { getLayerCakeContext } from 'layercake';
  import Line from '../primatives/Line.svg.svelte';

  interface Props {
    curve?: CurveFactory;
  }

  const k = getLayerCakeContext<LayerCakeScalesTypes, LayerCakeGroupedDataType>();

  let { curve }: Props = $props();

  const filteredLines = $derived(
    k.data.flatMap(({ values, config }) => {
      // Only lines
      if (config.type !== 'line') return [];

      // Remove data where y-axis value is null or undefined and resolve to rendered x/y values.
      const vals: [number, number][] = values.flatMap(d => {
        if (d.y === undefined || d.y === null) return [];
        return [[k.xGet(d), k.yGet(d)]];
      });

      // No empty series.
      if (vals.length === 0) return [];

      return [
        {
          id: config.id,
          data: vals,
          curveType: config.curveType,
          stroke: config.colour || (vals[0] ? k.zGet(vals[0]) : '#000'),
          dasharray: config.dasharray
        }
      ];
    })
  );
</script>

<g class="line-group">
  {#each filteredLines as { id, data, stroke, dasharray, curveType } (id || line)}
    <Line {data} {stroke} {dasharray} curve={curve || (curveType && curveMap[curveType]) || curveCardinal} />
  {/each}
</g>
