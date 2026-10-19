<svelte:options namespace="svg" />

<script lang="ts">
  import { curveCardinal, line, type CurveFactory } from 'd3-shape';
  import { Tween } from 'svelte/motion';

  interface Props {
    stroke: string;
    dasharray?: string;
    curve?: CurveFactory;
    data: [number, number][];
  }

  let { stroke, dasharray, curve = curveCardinal, data }: Props = $props();

  const chartData = Tween.of(() => data);
  const lineGenerator = $derived(line().curve(curve));
  let path = $derived(lineGenerator(chartData.current));
</script>

<g class="line" style:--line-dasharray={dasharray ? dasharray : undefined}>
  <path class="path-line outline" d={path}></path>
  <path class="path-line" d={path} {stroke}></path>
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
