<script lang="ts">
  import {
    AnnotationAnchorType,
    type AnnotationType,
    type DeletableType,
    type LayerCakeGroupedDataType,
    type LayerCakeScalesTypes
  } from '../../lib/types';
  import { fade } from 'svelte/transition';
  import { getAxisDataType } from '../../lib/state-accessors';
  import { builderState, visState } from '../../lib/state.svelte';
  import { coerceToColumnDataType } from '../../lib/data-helpers';
  import { getLayerCakeContext } from 'layercake';

  interface Props {
    annotations: (AnnotationType & DeletableType)[];
  }

  const { annotations }: Props = $props();

  const k = getLayerCakeContext<LayerCakeScalesTypes, LayerCakeGroupedDataType>();
  let xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  let yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

{#if xAxisDataType && yAxisDataType}
  {#each annotations.filter(d => !d.deleted) as annotation (annotation)}
    <span
      class="annotations__annotation"
      transition:fade
      style:--annotation-color={annotation.colour && annotation.colour.length > 3 ? annotation.colour : undefined}
      class:show-construction-marks={builderState.showConstructionMarks}
      style:left={`${k.xScale(coerceToColumnDataType(annotation.x, xAxisDataType))}px`}
      style:top={`${k.yScale(coerceToColumnDataType(annotation.y, yAxisDataType))}px`}
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
    box-shadow: 0px 0px 0px 1px #000;
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
