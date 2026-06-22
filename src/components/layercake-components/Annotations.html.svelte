<script lang="ts">
  import { getContext } from 'svelte';

  import {
    AnnotationAnchorType,
    type AnnotationType,
    type DeletableType,
    type LayerCakeContextType
  } from '../../lib/types';
  import { fade } from 'svelte/transition';
  import { getAxisDataType } from '../../lib/data-accessors';
  import { visState } from '../../lib/state.svelte';
  import { coerceToColumnDataType } from '../../lib/data-helpers';

  interface Props {
    annotations: (AnnotationType & DeletableType)[];
  }

  let { annotations }: Props = $props();
  const annotationsFiltered = $derived(annotations.filter(d => !d.deleted));
  const { xScale, yScale, custom } = getContext<LayerCakeContextType>('LayerCake');
  let xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  let yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

{#if xAxisDataType && yAxisDataType}
  {#each annotationsFiltered as annotation, i}
    <span
      class="annotations__annotation"
      data-type="annotation"
      data-index={i}
      transition:fade
      style:--annotation-color={annotation.colour && annotation.colour.length > 3 ? annotation.colour : undefined}
      class:show-construction-marks={$custom.showConstructionMarks}
      style:left={`${$xScale(coerceToColumnDataType(annotation.x, xAxisDataType) as any)}px`}
      style:top={`${$yScale(coerceToColumnDataType(annotation.y, yAxisDataType) as any)}px`}
      style:width={`${annotation.width}em`}
      class:middle={annotation.anchor === AnnotationAnchorType.Middle}
      class:top-left={annotation.anchor === AnnotationAnchorType.TopLeft}
      class:top={annotation.anchor === AnnotationAnchorType.Top}
      class:top-right={annotation.anchor === AnnotationAnchorType.TopRight}
      class:right={annotation.anchor === AnnotationAnchorType.Right}
      class:bottom-right={annotation.anchor === AnnotationAnchorType.BottomRight}
      class:bottom={annotation.anchor === AnnotationAnchorType.Bottom}
      class:bottom-left={annotation.anchor === AnnotationAnchorType.BottomLeft}
      class:left={annotation.anchor === AnnotationAnchorType.Left}
    >
      {annotation.label}
    </span>
  {/each}
{/if}

<style>
  .annotations__annotation {
    position: absolute;
    text-align: center;
    vertical-align: middle;
    text-wrap: balance;
    paint-order: stroke fill;
    color: var(--annotation-color, #000);

    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #fff;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%;
  }

  @container (width > 462px) {
    .annotations__annotation {
      /* Desktop settings */
      font-size: 14px;
    }
  }

  .middle {
    transform: translate(-50%, -50%);
  }

  .top-left {
    transform: translate(0, 0);
  }

  .top {
    transform: translateX(-50%);
  }

  .top-right {
    transform: translateX(-100%);
  }

  .right {
    transform: translate(-100%, -50%);
  }

  .bottom-right {
    transform: translate(-100%, -100%);
  }

  .bottom {
    transform: translate(-50%, -100%);
  }

  .bottom-left {
    transform: translate(0, -100%);
  }

  .left {
    transform: translate(0, -50%);
  }

  .show-construction-marks {
    border: 1px solid black;
  }

  .show-construction-marks::after {
    content: '';
    position: absolute;
    display: block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: red;
    left: 0;
    top: 0;
    transform: translate(-50%, -50%);
  }

  .show-construction-marks.top::after {
    left: 50%;
    top: 0;
  }
  .show-construction-marks.top-right::after {
    left: 100%;
    top: 0;
  }
  .show-construction-marks.right::after {
    left: 100%;
    top: 50%;
  }
  .show-construction-marks.bottom-right::after {
    left: 100%;
    top: 100%;
  }
  .show-construction-marks.bottom::after {
    left: 50%;
    top: 100%;
  }
  .show-construction-marks.bottom-left::after {
    left: 0%;
    top: 100%;
  }
  .show-construction-marks.left::after {
    left: 0%;
    top: 50%;
  }
</style>
