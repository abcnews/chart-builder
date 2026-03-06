<script lang="ts">
  import { getContext } from 'svelte';
  import {
    line,
    curveCardinal,
    curveLinear,
    curveStep,
    curveStepAfter,
    curveStepBefore,
    curveMonotoneX,
    type CurveFactory
  } from 'd3-shape';
  import { type LayerCakeContextType, type LayerCakeGroupedDataGroupValuesType } from '../../lib/types';

  interface Props {
    curve?: CurveFactory;
  }
  const { data, xGet, yGet, zGet } = getContext<LayerCakeContextType>('LayerCake');

  let { curve }: Props = $props();

  const curveMap = {
    linear: curveLinear,
    cardinal: curveCardinal,
    step: curveStep,
    stepAfter: curveStepAfter,
    stepBefore: curveStepBefore,
    monotoneX: curveMonotoneX
  };

  const renderedLines = $derived(
    $data.flatMap(({ values, config }) => {
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
          ),
          stroke: config.colour || (vals[0] ? $zGet(vals[0]) : '#000'),
          dasharray: config.dasharray
        }
      ];
    })
  );
</script>

<g class="line-group">
  {#each renderedLines as line (line.id || line)}
    <g class="line" style:--line-dasharray={line.dasharray ? line.dasharray : undefined}>
      <path class="path-line outline" d={line.d}></path>
      <path class="path-line" d={line.d} stroke={line.stroke}></path>
    </g>
  {/each}
</g>

<style>
  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2px;
    stroke-dasharray: var(--line-dasharray, none);

    &.outline {
      stroke-width: 3px;
      stroke: #fff;
    }
  }
</style>
