<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fade } from 'svelte/transition';

  let {
    x,
    y,
    offsetX,
    offsetY,
    orientation = 'middle',
    text,
    content = undefined
  }: {
    x: number;
    y: number;
    orientation?: 'middle' | 'left' | 'right' | 'above' | 'below';
    text?: string;
    variant?: 'circle' | 'square' | 'diamond';
    size?: 'small' | 'large';
    offsetX?: number;
    offsetY?: number;
    content?: Snippet | undefined;
  } = $props();

  let width = $state(0);
  let height = $state(0);
</script>

{#key `${text}-${x}-${y}`}
  <div
    in:fade|global={{ delay: 0 }}
    out:fade|global={{ delay: 0 }}
    class="label-position"
    style:left={x + (offsetX || 0) + 'px'}
    style:top={y + (offsetY || 0) + 'px'}
    style:--label-width={width + 'px'}
    style:--label-height={height + 'px'}
  >
    <div bind:clientWidth={width} bind:clientHeight={height} class="label {orientation}">
      {#if content}{@render content()}{:else}{text}{/if}
    </div>
  </div>
{/key}

<style>
  .label-position {
    position: absolute;
    width: 0px;
    height: 0px;
  }

  .label {
    font-family: var(--dls-font-stack-sans);
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%;
    color: var(--highlighter-color);

    position: absolute;
    display: block;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    text-shadow:
      -1px -1px 0 white,
      1px -1px 0 white,
      -1px 1px 0 white,
      1px 1px 0 white;
  }

  @media (min-width: 72rem) {
    .label {
      font-size: 16px;
    }
  }

  .left {
    right: calc(0.875em);
    transform: translate(0, calc(-1px - 50%));
    text-align: right;
  }
  .right {
    left: calc(0.875em);
    transform: translate(0, calc(-1px - 50%));
    text-align: left;
  }
  .above {
    bottom: calc(2px + var(--label-height, 0px) / 2);
    transform: translate(-50%, 0);
    text-align: center;
  }
  .below {
    top: calc(2px + var(--label-height, 0px) / 2);
    transform: translate(-50%, 0);
    text-align: center;
  }
</style>
