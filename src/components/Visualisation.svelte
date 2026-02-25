<script lang="ts">
  import { visState } from '../lib/state.svelte';

  import { LayerCake, Svg, Html } from 'layercake';

  import { scaleOrdinal } from 'd3-scale';
  import { timeFormat } from 'd3-time-format';
  import { format } from 'd3-format';
  import AxisX from './layercake-components/AxisX.svg.svelte';
  import AxisY from './layercake-components/AxisY.svg.svelte';
  import { defaultAxisLabelFormatStrings, plotPadding } from '../lib/constants';
  import Annotations from './layercake-components/Annotations.html.svelte';
  import Arrows from './layercake-components/Arrows.svg.svelte';
  import BackgroundHighlight from './layercake-components/BackgroundHighlight.svelte';
  import type { AxisOptionsType, ColumnTypesType, CustomLayerCakeContextType } from '../lib/types';
  import Lines from './layercake-components/Lines.svg.svelte';
  import FontProvider from './FontProvider.svelte';

  import { csvParse } from 'd3-dsv';
  import { rowParser } from '../lib/data-helpers';
  import { getAxisDataType } from '../lib/data-accessors';

  interface Props {
    showConstructionMarks?: boolean;
  }

  const xKey = 'x';
  const yKey = 'y';
  const zKey = 'series';

  const rawData: Record<string, string> = $state({});

  $effect(() => {
    visState.config.data.forEach(async ({ name, url }) => {
      const raw = await fetch(url).then(res => res.text());
      rawData[name] = raw;
    });
  });

  let seriesWithData = $derived.by(() => {
    return visState.config.series.flatMap(series => {
      if (series.deleted) return [];
      const dataset = visState.config.data.find(data => data.name === series.dataset);
      if (typeof dataset === 'undefined') return [];
      const raw = rawData[dataset.name];
      if (typeof raw === 'undefined') return [];
      const data = csvParse(raw, rowParser(dataset.columns));
      return [{ id: series.id, x: series.x, y: series.y, columns: dataset.columns, type: series.type, data }];
    });
  });

  let flatData = $derived.by(() => {
    const series = seriesWithData;
    const result = series.flatMap(({ x, y, data, id }) => {
      if (typeof x === 'undefined' || typeof y === 'undefined') {
        console.warn(`Missing x or y column for series ${id}`);
        return [];
      }
      return data.map(d => {
        return { x: d[x], y: d[y], series: id };
      });
    });

    return result;
  });

  let groupedData = $derived.by(() => {
    const grouped = Object.entries(Object.groupBy(flatData, d => d.series));
    return grouped.map(([series, data]) => {
      return { group: series, values: data };
    });
  });

  const seriesColors = ['#007BC7', '#00297E'];

  let annotations = $derived(visState.config.annotations.filter(d => !d.deleted));
  let arrows = $derived(visState.config.arrows.filter(d => !d.deleted));
  let series = $derived(visState.config.series.filter(d => !d.deleted));

  let xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  let yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));

  let getAxisLabelFormatter = (axisOptions: AxisOptionsType, axisDataType: ColumnTypesType) => {
    if (axisDataType === 'date') return timeFormat(axisOptions.format || defaultAxisLabelFormatStrings.date);
    if (axisDataType === 'number') {
      return (d: number) => {
        try {
          return format(axisOptions.format || defaultAxisLabelFormatStrings.number)(d);
        } catch (e) {
          return format(defaultAxisLabelFormatStrings.number)(d);
        }
      };
    }

    // Default to returning coercing to a string for booleans or strings
    return (d: string | boolean): string => String(d);
  };

  let formatLabelX = $derived(xAxisDataType && getAxisLabelFormatter(visState.config.axes.x, xAxisDataType));
  let formatLabelY = $derived(yAxisDataType && getAxisLabelFormatter(visState.config.axes.y, yAxisDataType));
  let chartWidth: number = $state(0);
  let { showConstructionMarks = false }: Props = $props();

  let customLayerCakeContext: CustomLayerCakeContextType = $derived({ showConstructionMarks });
</script>

<FontProvider>
  <div
    bind:clientWidth={chartWidth}
    style:--plot-padding-left={`${plotPadding.left}px`}
    style:--plot-padding-right={`${plotPadding.right}px`}
  >
    <header>
      {#if visState.config.title && visState.config.title.length > 0}
        <h2 class="chart-title">{visState.config.title}</h2>
      {/if}
      {#if visState.config.subtitle && visState.config.subtitle.length > 0}
        <h3 class="chart-subtitle">{visState.config.subtitle}</h3>
      {/if}
    </header>

    <LayerCake
      padding={plotPadding}
      x={xKey}
      y={yKey}
      z={zKey}
      zScale={scaleOrdinal()}
      zRange={seriesColors}
      {flatData}
      data={groupedData}
      custom={customLayerCakeContext}
    >
      <Html>
        <BackgroundHighlight />
      </Html>
      <Svg>
        <AxisX gridlines={false} ticks={Math.floor(chartWidth / 130)} format={formatLabelX} tickMarks />
        <AxisY ticks={4} format={formatLabelY} />
        <Lines lines={series.filter(s => s.type === 'line')} />
      </Svg>
      <Html>
        <Annotations {annotations} />
      </Html>
      <Svg>
        <Arrows {arrows} />
      </Svg>
    </LayerCake>

    {#if (visState.config.description && visState.config.description.length > 0) || visState.config.sources.length}
      <footer>
        {#if visState.config.description}<p>{visState.config.description}</p>{/if}
        {#if visState.config.sources.length > 0}
          <p>
            Sources:
            {#each visState.config.sources as source, i}
              {#if i > 0}·
              {/if}{#if source.url && source.url.length > 0}<a href={source.url}>{source.label}</a>{:else}<span
                  >{source.label}</span
                >{/if}
            {/each}
          </p>
        {/if}
      </footer>
    {/if}
  </div>
</FontProvider>

<style lang="scss">
  div {
    width: 100%;
    height: 100%;
    // padding: 1em 10px 35px 30px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  header,
  footer {
    margin: 1.25em var(--plot-padding-right, 1em) 1em var(--plot-padding-left, 0);

    > :first-child {
      margin-top: 0;
    }
    > :last-child {
      margin-bottom: 0;
    }
  }

  .chart-title {
    font-family: var(--sl-font-stack-serif);
  }
</style>
