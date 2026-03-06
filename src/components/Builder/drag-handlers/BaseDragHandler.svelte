<script lang="ts">
  import { getContext } from 'svelte';
  import { plotPadding } from '../../../lib/constants';
  import type { LayerCakeContextType, ColumnTypesType } from '../../../lib/types';

  const { xScale, yScale, width, height } = getContext<LayerCakeContextType>('LayerCake');

  interface Props {
    type: string;
    xAxisDataType: ColumnTypesType | undefined;
    yAxisDataType: ColumnTypesType | undefined;
    getInitialPos: (index: number, handle: string | null) => { x: any; y: any } | null;
    onMove: (index: number, handle: string | null, x: any, y: any) => void;
    coerceValue: (val: any, type: any) => any;
  }

  let { type, xAxisDataType, yAxisDataType, getInitialPos, onMove, coerceValue }: Props = $props();

  /**
   * Translates a pixel coordinate in the chart container into a domain value.
   */
  const getDomainValue = (pixelValue: number, axis: 'x' | 'y', scale: any, dataType: ColumnTypesType | undefined) => {
    if (typeof scale.invert !== 'function') {
      return undefined;
    }

    const offset = axis === 'x' ? plotPadding.left || 0 : (plotPadding as any).top || 0;
    const value: any = scale.invert(pixelValue - offset);

    if (dataType === 'date' && value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    if (dataType === 'number' && typeof value === 'number') {
      return Number(value.toFixed(2));
    }
    return value;
  };

  /**
   * Snaps a pixel value to the nearest grid increment.
   */
  const snapToGrid = (value: number, step: number = 5) => {
    return Math.round(value / step) * step;
  };

  type DragInfo = {
    index: number;
    handle: string | null;
    grabOffsetX: number;
    grabOffsetY: number;
  };

  let dragInfo = $state<DragInfo | null>(null);

  const onmousedown = (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest(`[data-type="${type}"]`);
    if (!target || !target.closest('.visualisation')) return;

    const index = Number(target.getAttribute('data-index'));
    const handle = target.getAttribute('data-handle');

    const rect = document.querySelector('.visualisation .layercake-container')?.getBoundingClientRect();
    if (!rect) return;

    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    const initialPos = getInitialPos(index, handle);
    if (!initialPos) return;

    const currentX = $xScale(coerceValue(initialPos.x, xAxisDataType)) + (plotPadding.left || 0);
    const currentY = $yScale(coerceValue(initialPos.y, yAxisDataType)) + ((plotPadding as any).top || 0);

    dragInfo = {
      index,
      handle,
      grabOffsetX: startX - currentX,
      grabOffsetY: startY - currentY
    };

    e.preventDefault();
    e.stopPropagation();
  };

  const onmousemove = (e: MouseEvent) => {
    if (!dragInfo) return;

    const rect = document.querySelector('.visualisation .layercake-container')?.getBoundingClientRect();
    if (!rect) return;

    const rawX = e.clientX - rect.left - dragInfo.grabOffsetX;
    const rawY = e.clientY - rect.top - dragInfo.grabOffsetY;

    const snappedX = snapToGrid(rawX);
    const snappedY = snapToGrid(rawY);

    const domainX = getDomainValue(snappedX, 'x', $xScale, xAxisDataType);
    const domainY = getDomainValue(snappedY, 'y', $yScale, yAxisDataType);

    onMove(dragInfo.index, dragInfo.handle, domainX, domainY);
  };

  const onmouseup = () => {
    dragInfo = null;
  };
</script>

<svelte:window {onmousedown} {onmousemove} {onmouseup} />

{#if dragInfo}
  <div class="drag-overlay" style:width="{$width}px" style:height="{$height}px"></div>
{/if}

<style>
  /* Global overrides to enable builder interactivity without touching production components */
  :global(.visualisation .layercake-layout-html),
  :global(.visualisation .layercake-layout-svg) {
    pointer-events: none;
  }
  :global(.visualisation [data-type]) {
    pointer-events: auto;
    cursor: move;
  }
  :global(.visualisation [data-handle]) {
    cursor: crosshair;
  }

  .drag-overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10000;
    cursor: grabbing;
    background: rgba(255, 255, 255, 0);
  }
</style>
