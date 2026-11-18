<script lang="ts">
  import { line, curveCardinal, type CurveFactory } from 'd3-shape';
  import { type LayerCakeGroupedDataType, type LayerCakeScalesTypes } from '../../lib/types';
  import { curveMap } from '../../lib/curves';
  import { getLayerCakeContext } from 'layercake';
  import Line from './Line.svg.svelte';
  import { getDomain, getFlatData } from '../../lib/state-accessors';
  import { visState } from '../../lib/state.svelte';
  import { scaleLinear } from 'd3-scale';

  interface Props {
    curve?: CurveFactory;
  }

  const k = getLayerCakeContext<LayerCakeScalesTypes, LayerCakeGroupedDataType>();

  let { curve }: Props = $props();

  const filteredLines = $derived.by(() => {
    return k.data.flatMap(({ values, config }) => {
      // Only lines
      if (config.type !== 'line') return [];

      // Remove data where y-axis value is null or undefined and resolve to rendered x/y values.
      const vals = values.flatMap(d => {
        if (d.y === undefined || d.y === null) return [];
        return [d];
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
    });
  });

  // These need to be calculated independently of the domain/range/scale values in the LayerCake context object because
  // lines need to tween independently of the x- and y-axis to avoid unwanted effects of compounding tweens.
  const [xScale, yScale] = $derived.by(() => {
    const flatData = getFlatData(visState.config.series, visState.config.data, visState.data);
    const xAxisDataType = visState.config.axes.x.type;
    const yAxisDataType = visState.config.axes.y.type;

    const xDomain = getDomain(
      [visState.config.axes.x.domain.min, visState.config.axes.x.domain.max],
      flatData.map(d => d.x),
      xAxisDataType
    );
    const yDomain = getDomain(
      [visState.config.axes.y.domain.min, visState.config.axes.y.domain.max],
      flatData.map(d => d.y),
      yAxisDataType
    );

    let xScale = scaleLinear<number | Date, number>(xDomain || [0, 0], k.xRange);
    let yScale = scaleLinear<number | Date, number>(yDomain || [0, 0], k.yRange);
    return [xScale, yScale];
  });
</script>

<g class="line-group">
  {#each filteredLines as { id, data, stroke, dasharray, curveType } (id || line)}
    <Line
      {data}
      {xScale}
      {yScale}
      {stroke}
      {dasharray}
      curve={curve || (curveType && curveMap[curveType]) || curveCardinal}
    />
  {/each}
</g>
