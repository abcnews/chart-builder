<script lang="ts">
  import { LayerCake, Svg, Html } from 'layercake';
  import { Tween } from 'svelte/motion';

  import { scaleOrdinal } from 'd3-scale';
  import { csvParse } from 'd3-dsv';

  import FontProvider from './FontProvider.svelte';
  import AxisX from './layercake-components/AxisX.svg.svelte';
  import AxisY from './layercake-components/AxisY.svg.svelte';
  import Annotations from './layercake-components/Annotations.html.svelte';
  import Arrows from './layercake-components/Arrows.svg.svelte';
  import BackgroundHighlight from './layercake-components/BackgroundHighlight.svelte';
  import Lines from './layercake-components/Lines.svg.svelte';

  import type {
    CustomLayerCakeContextType,
    LayerCakeGroupedDataGroupValuesType,
    LayerCakeGroupedDataType
  } from '../lib/types';

  import { getAxisLabelFormatter, getDefaultPalette, getDomain, rowParser } from '../lib/data-helpers';
  import { getAxisDataType } from '../lib/data-accessors';

  import { visState } from '../lib/state.svelte';
  import { plotPadding } from '../lib/constants';
  import { untrack } from 'svelte';

  interface Props {
    showConstructionMarks?: boolean;
  }

  // TODO: Move fetched and parsed data to a central state object from state.svelte.ts
  // A state variable to store the raw data from each of the data sources defined in the config.
  const rawData: Record<string, string> = $state({});

  // Load these into state via an effect to avoid use of #await. If the config changes so a new data needs to be fetched
  // we don't want the UI to change to an awaiting state while it's loading.
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
      return [{ config: series, columns: dataset.columns, data }];
    });
  });

  let flatData: LayerCakeGroupedDataGroupValuesType[] = $derived.by(() => {
    return seriesWithData.flatMap(({ config, data }) => {
      const { x, y, id } = config;
      if (typeof x === 'undefined' || typeof y === 'undefined') {
        console.warn(`Missing x or y column for series ${id}`);
        return [];
      }
      return data.map(d => {
        return { x: d[x], y: d[y], z: id, row: d };
      });
    });
  });

  let groupedData: LayerCakeGroupedDataType = $derived.by(() => {
    const data = seriesWithData.flatMap(series => {
      const { x, y, id } = series.config;
      if (typeof x === 'undefined' || typeof y === 'undefined') {
        console.warn(`Missing x or y column for series ${series.config.id}`);
        return [];
      }
      return [
        {
          group: series.config.id,
          values: series.data.map(d => ({ x: d[x], y: d[y], z: id, row: d })),
          config: series.config
        }
      ];
    });
    return data;
  });

  // TODO: Warn if there are too many categories.
  let seriesColors = $derived(getDefaultPalette(visState.config.series));

  let annotations = $derived(visState.config.annotations.filter(d => !d.deleted));
  let arrows = $derived(visState.config.arrows.filter(d => !d.deleted));
  let series = $derived(visState.config.series.filter(d => !d.deleted));

  let xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  let yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));

  let formatLabelX = $derived(xAxisDataType && getAxisLabelFormatter(visState.config.axes.x, xAxisDataType));
  let formatLabelY = $derived(yAxisDataType && getAxisLabelFormatter(visState.config.axes.y, yAxisDataType));
  let chartWidth: number = $state(0);

  let { showConstructionMarks = false }: Props = $props();

  let xDomain = $derived(
    getDomain(
      visState.config.axes.x,
      flatData.map(d => d.x),
      xAxisDataType
    )
  );
  let yDomain = $derived(
    getDomain(
      visState.config.axes.y,
      flatData.map(d => d.y),
      yAxisDataType
    )
  );

  let xAxisDomainTween = $derived.by(() => {
    if (flatData.length === 0) return undefined;
    if (xAxisDataType === 'number') return new Tween(untrack(() => xDomain));
    if (xAxisDataType === 'date') return new Tween(untrack(() => xDomain));
    return undefined;
  });

  let yAxisDomainTween = $derived.by(() => {
    if (flatData.length === 0) return undefined;
    if (yAxisDataType === 'number') return new Tween(untrack(() => yDomain));
    if (yAxisDataType === 'date') return new Tween(untrack(() => yDomain));
    return undefined;
  });

  $effect(() => {
    if (xDomain && xAxisDomainTween) {
      xAxisDomainTween.target = xDomain;
    }
  });

  $effect(() => {
    if (yDomain && yAxisDomainTween) {
      yAxisDomainTween.target = yDomain;
    }
  });

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
      x="x"
      y="y"
      z="series"
      xDomain={xAxisDomainTween ? xAxisDomainTween.current : xDomain}
      yDomain={yAxisDomainTween ? yAxisDomainTween.current : yDomain}
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
        <AxisX
          gridlines={false}
          ticks={Math.floor(chartWidth / 130)}
          format={formatLabelX}
          dy={14}
          baseline={true}
          tickMarks
        />
        <AxisY ticks={4} format={formatLabelY} />
      </Svg>
      <Svg overflow="hidden">
        <Lines />
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
    margin: 1.25em 1em;

    > :first-child {
      margin-top: 0;
    }
    > :last-child {
      margin-bottom: 0;
    }
  }

  .chart-title {
    font-family: var(--sl-font-stack-sans);
    font-size: calc(1rem * (20 / 16));
  }
</style>
