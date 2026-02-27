<script lang="ts">
  import { type format as d3Format } from 'd3-format';
  import type { timeFormat as d3TimeFormat } from 'd3-time-format';
  import { getContext } from 'svelte';
  import { type LayerCakeContextType } from '../../lib/types';

  const { xRange, yScale, width } = getContext<LayerCakeContextType>('LayerCake');

  interface Props {
    tickMarks?: boolean;
    labelPosition?: string;
    snapBaselineLabel?: boolean;
    gridlines?: boolean;
    tickMarkLength?: number;
    format?: ReturnType<typeof d3Format> | ReturnType<typeof d3TimeFormat>;
    ticks?: number | Array<any> | Function;
    tickGutter?: number;
    dx?: number;
    dy?: number;
    charPixelWidth?: number;
  }

  let {
    tickMarks = false,
    labelPosition = 'even',
    snapBaselineLabel = false,
    gridlines = true,
    tickMarkLength = undefined,
    format = d => String(d),
    ticks = 4,
    tickGutter = 0,
    dx = 0,
    dy = 0,
    charPixelWidth = 7.25
  }: Props = $props();

  function calcStringLength(sum: number, val: string) {
    if (val === ',' || val === '.') return sum + charPixelWidth * 0.5;
    return sum + charPixelWidth;
  }

  let isBandwidth = $derived(typeof $yScale.bandwidth === 'function');

  /** @type {Array<any>} */
  let tickVals = $derived(
    Array.isArray(ticks)
      ? ticks
      : isBandwidth
        ? $yScale.domain()
        : typeof ticks === 'function'
          ? ticks($yScale.ticks())
          : $yScale.ticks(ticks)
  );
  let widestTickLen = $derived(
    Math.max(10, Math.max(...tickVals.map(d => format(d).toString().split('').reduce(calcStringLength, 0))))
  );
  let tickLen = $derived(
    tickMarks === true ? (labelPosition === 'above' ? (tickMarkLength ?? widestTickLen) : (tickMarkLength ?? 6)) : 0
  );
  let x1 = $derived(-tickGutter - (labelPosition === 'above' ? widestTickLen : tickLen));
  let y = $derived(isBandwidth ? $yScale.bandwidth() / 2 : 0);
  let maxTickValPx = $derived(Math.max(...tickVals.map($yScale)));
</script>

<g class="axis y-axis">
  {#each tickVals as tick (tick)}
    {@const tickValPx = $yScale(tick)}
    <g class="tick tick-{tick}" transform="translate({$xRange[0]}, {tickValPx})">
      {#if gridlines === true}
        <line class="gridline" class:zero={tick === 0} {x1} x2={$width} y1={y} y2={y}></line>
      {/if}
      {#if tickMarks === true}
        <line class="tick-mark" {x1} x2={x1 + tickLen} y1={y} y2={y}></line>
      {/if}
      <text
        x={x1}
        {y}
        dx={dx + (labelPosition === 'even' ? -3 : 0)}
        text-anchor={labelPosition === 'above' ? 'start' : 'end'}
        dy={dy + (labelPosition === 'above' || (snapBaselineLabel === true && tickValPx === maxTickValPx) ? -3 : 4)}
        >{format(tick)}</text
      >
    </g>
  {/each}
</g>

<style>
  .tick {
    font-size: 11px;
  }

  .tick line {
    stroke: #d6dde4;
    stroke-width: 1px;
  }

  .gridline.zero {
    stroke: #68788e;
  }

  .tick text {
    fill: #68788e;
    font-size: 12px;
  }

  .tick.tick-0 line {
    stroke-dasharray: 0;
  }
</style>
