<script lang="ts">
  import { getContext } from 'svelte';
  import { type LayerCakeContextType } from '../../lib/types';

  const { data, xGet, yGet, xScale, yRange, width } = getContext<LayerCakeContextType>('LayerCake');
</script>

<g class="column-group">
  {#each $data as { values, config }}
    {#if config.type === 'column'}
      {#each values as d}
        {@const colWidth = ($width / values.length) * 0.8}
        {@const xPos = $xGet(d) - colWidth / 2}
        {@const yPos = $yGet(d)}
        {@const colHeight = $yRange[0] - yPos}
        <rect
          x={xPos}
          y={yPos}
          width={colWidth}
          height={colHeight}
          fill={config.colour || '#00e047'}
        />
      {/each}
    {/if}
  {/each}
</g>