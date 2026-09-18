<script lang="ts">
  let { children, columns = 2, label = '' } = $props();
</script>

<div>
  {#if label}<span>{label}</span>{/if}
  <div class={`columns-${columns}`}>
    {@render children()}
  </div>
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
