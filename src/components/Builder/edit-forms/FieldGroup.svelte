<script lang="ts">
  let { children, columns = 2, label = '' } = $props();
</script>

{#if label}<span>{label}</span>{/if}
<div class={`columns-${columns}`}>
  {@render children()}
</div>

<style>
  div {
    display: grid;
    row-gap: 5px;
    column-gap: 5px;
  }
  .columns-2 {
    grid-template-columns: auto auto;
  }
  .columns-3 {
    grid-template-columns: auto auto;
  }
</style>
