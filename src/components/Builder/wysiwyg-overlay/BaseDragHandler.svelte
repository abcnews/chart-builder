<script lang="ts">
  import { coerceToColumnDataType } from '../../../lib/data-helpers';
  import { getAxisDataType } from '../../../lib/state-accessors';
  import { visState } from '../../../lib/state.svelte';
  import type { LayerCakeScalesTypes, LayerCakeGroupedDataType, ChartPositionType } from '../../../lib/types';
  import { getLayerCakeContext } from 'layercake';

  const k = getLayerCakeContext<LayerCakeScalesTypes, LayerCakeGroupedDataType>();

  /**
   * BaseDragHandler provides a system for dragging elements on a Chart.
   * It handles coordinate inversion, grid snapping, grab-offsets, and cursor state.
   *
   * To implement a new drag handler:
   * 1. Create a wrapper component.
   * 2. Import and use `BaseDragHandler`.
   * 3. Pass a unique `type` (matching a `data-type` on your draggable HTML/SVG elements).
   * 4. Define `getInitialPos` and `onMove` to bridge the drag logic with your state.
   */

  interface Props {
    /** The unique identifier for the element type being dragged (matches `[data-type="${type}"]`). */
    type: string;
    /** Returns the initial domain coordinates {x, y} for the element at the given index. */
    getInitialPos: (index: number, handle: string | null) => ChartPositionType;
    /** Callback triggered during drag to update the state with new domain coordinates. */
    onMove: (index: number, handle: string | null, x: any, y: any) => void;
  }

  let { type, getInitialPos, onMove }: Props = $props();

  const xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  const yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));

  /**
   * Translates a pixel coordinate in the chart container into a domain value.
   * There's an extra layer of indirection here over relying on the scales in LayerCake config primarily in order to
   * round values to something sensible.
   */
  const getDomainValue = (pixelValue: number, axis: 'x' | 'y') => {
    const scale = axis === 'x' ? k.xScale : k.yScale;
    const axisDataType = axis === 'x' ? xAxisDataType : yAxisDataType;

    if (!scale || !axisDataType) return undefined;

    const value = coerceToColumnDataType(scale.invert(pixelValue), axisDataType);

    if (axisDataType === 'date' && value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    if (axisDataType === 'number' && typeof value === 'number') {
      return Number(value.toFixed(2));
    }
    return value;
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
    if (xAxisDataType === undefined || yAxisDataType === undefined) return;

    const index = Number(target.getAttribute('data-index'));
    const handle = target.getAttribute('data-handle');

    const { x: configX, y: configY } = getInitialPos(index, handle);

    const [grabX, grabY] = k.pointer(e);

    const currentX = k.xScale(coerceToColumnDataType(configX, xAxisDataType));
    const currentY = k.yScale(coerceToColumnDataType(configY, yAxisDataType));

    dragInfo = {
      index,
      handle,
      grabOffsetX: grabX - currentX,
      grabOffsetY: grabY - currentY
    };

    e.preventDefault();
    e.stopPropagation();
  };

  const onmousemove = (e: MouseEvent) => {
    if (!dragInfo) return;

    const [pointerX, pointerY] = k.pointer(e);

    const rawX = pointerX - dragInfo.grabOffsetX;
    const rawY = pointerY - dragInfo.grabOffsetY;

    const domainX = getDomainValue(rawX, 'x');
    const domainY = getDomainValue(rawY, 'y');

    onMove(dragInfo.index, dragInfo.handle, domainX, domainY);
  };

  const onmouseup = () => {
    dragInfo = null;
  };
</script>

<svelte:window {onmousedown} {onmousemove} {onmouseup} />
