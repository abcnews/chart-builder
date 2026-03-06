<script lang="ts">
  import { visState } from '../../../lib/state.svelte';
  import { getAxisDataType } from '../../../lib/data-accessors';
  import { coerceToColumnDataType } from '../../../lib/data-helpers';
  import BaseDragHandler from './BaseDragHandler.svelte';

  let xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  let yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

<BaseDragHandler
  type="arrow"
  {xAxisDataType}
  {yAxisDataType}
  coerceValue={coerceToColumnDataType}
  getInitialPos={(index, handle) => {
    const filtered = visState.config.arrows.filter(d => !d.deleted);
    const arrow = filtered[index];
    if (!arrow) return null;
    return handle === 'from' ? arrow.from : arrow.to;
  }}
  onMove={(index, handle, x, y) => {
    const filtered = visState.config.arrows.filter(d => !d.deleted);
    const arrow = filtered[index];
    if (arrow) {
      if (handle === 'from') {
        arrow.from.x = x;
        arrow.from.y = y;
      } else {
        arrow.to.x = x;
        arrow.to.y = y;
      }
    }
  }}
/>
