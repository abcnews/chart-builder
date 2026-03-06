<script lang="ts">
  import { visState } from '../../../lib/state.svelte';
  import { getAxisDataType } from '../../../lib/data-accessors';
  import { coerceToColumnDataType } from '../../../lib/data-helpers';
  import BaseDragHandler from './BaseDragHandler.svelte';

  let xAxisDataType = $derived(getAxisDataType(visState.config, 'x'));
  let yAxisDataType = $derived(getAxisDataType(visState.config, 'y'));
</script>

<BaseDragHandler
  type="annotation"
  {xAxisDataType}
  {yAxisDataType}
  coerceValue={coerceToColumnDataType}
  getInitialPos={index => {
    const filtered = visState.config.annotations.filter(d => !d.deleted);
    const ann = filtered[index];
    return ann ? { x: ann.x, y: ann.y } : null;
  }}
  onMove={(index, handle, x, y) => {
    const filtered = visState.config.annotations.filter(d => !d.deleted);
    const ann = filtered[index];
    if (ann) {
      ann.x = x;
      ann.y = y;
    }
  }}
/>
