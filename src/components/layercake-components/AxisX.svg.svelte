<script lang="ts">
  import type { format as d3Format } from 'd3-format';
  import type { timeFormat as d3TimeFormat } from 'd3-time-format';
  import { type LayerCakeGroupedDataType, type LayerCakeScalesTypes } from '../../lib/types';
  import { getLayerCakeContext } from 'layercake';
  import { getAxisDataType } from '../../lib/state-accessors';
  import { visState } from '../../lib/state.svelte';

  const k = getLayerCakeContext<LayerCakeScalesTypes, LayerCakeGroupedDataType>();
  let xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));

  interface Props {
    tickMarks?: boolean;
    gridlines?: boolean;
    tickMarkLength?: number;
    baseline?: boolean;
    snapLabels?: boolean;
    format?: ReturnType<typeof d3Format> | ReturnType<typeof d3TimeFormat>;
    ticks?: number | (number | Date)[];
    tickGutter?: number;
    dx?: number;
    dy?: number;
  }

  let {
    tickMarks = false,
    gridlines = true,
    tickMarkLength = 5,
    baseline = false,
    snapLabels = false,
    format = d => String(d),
    ticks = undefined,
    tickGutter = 0,
    dx = 0,
    dy = 12
  }: Props = $props();

  function textAnchor(i: number, sl: boolean) {
    if (sl === true) {
      if (i === 0) {
        return 'start';
      }
      if (i === tickVals.length - 1) {
        return 'end';
      }
    }
    return 'middle';
  }

  let tickLen = $derived(tickMarks === true ? (tickMarkLength ?? 6) : 0);

  let tickVals = $derived(Array.isArray(ticks) ? ticks : k.xScale.ticks(ticks));
</script>

{#if xAxisDataType}
  <g class="axis x-axis" class:snapLabels>
    {#if baseline === true}
      <line class="baseline" y1={k.height} y2={k.height} x1="0" x2={k.width} />
    {/if}
    {#each tickVals as tick, i (tick)}
      <g class="tick tick-{i}" transform="translate({k.xScale(tick)},{Math.max(...k.yRange)})">
        {#if gridlines === true}
          <line class="gridline" x1={0} x2={0} y1={-k.height} y2="0" />
        {/if}
        {#if tickMarks === true}
          <line class="tick-mark" x1={0} x2={0} y1={tickGutter} y2={tickGutter + tickLen} />
        {/if}
        <text x={0} y={tickGutter + tickLen} {dx} {dy} text-anchor={textAnchor(i, snapLabels)}
          >{format(
            /* @ts-expect-error There is a long and complicated explanation for this error related to "union subtype reduction" */
            tick
          )}</text
        >
      </g>
    {/each}
  </g>
{/if}

<style>
  .tick {
    font-size: 11px;
  }

  line,
  .tick line {
    stroke: #d6dde4;
    stroke-width: 1px;
  }

  .tick text {
    fill: #68788e;
    font-size: 12px;
  }

  /* This looks slightly better */
  .axis.snapLabels .tick:last-child text {
    transform: translateX(3px);
  }
  .axis.snapLabels .tick.tick-0 text {
    transform: translateX(-3px);
  }
</style>
