<script lang="ts">
  import { visState } from '../../../lib/state.svelte';
  import BaseDragHandler from './BaseDragHandler.svelte';
  import Annotation from '../../layercake-components/Annotation.html.svelte';

  let annotations = $derived(visState.config.annotations.filter(d => !d.deleted));
  let xAxisDataType = $derived(visState.config.axes.x.type);
  let yAxisDataType = $derived(visState.config.axes.y.type);
</script>

{#if xAxisDataType && yAxisDataType}
  {#each annotations as annotation, i (annotation.label)}
    <span class="annotation-move-handle" data-type="annotation" data-index={i} data-handle="position">
      <span style:opacity={0}><Annotation {annotation} /></span>
    </span>
  {/each}
{/if}

<BaseDragHandler
  type="annotation"
  getInitialPos={index => {
    const filtered = visState.config.annotations.filter(d => !d.deleted);
    const ann = filtered[index];
    return { x: ann.x, y: ann.y };
  }}
  onMove={(index, handle, x, y) => {
    const filtered = visState.config.annotations.filter(d => !d.deleted);
    const ann = filtered[index];
    if (ann) {
      if (handle === 'position') {
        ann.x = x;
        ann.y = y;
      }
    }
  }}
/>

<style>
  .annotation-move-handle {
    pointer-events: all;
    cursor: move;
    z-index: 10;
    position: absolute;
  }
</style>
