<script lang="ts">
  import { fade } from 'svelte/transition';
  import { distance, generateArrowPath, unitVector } from '../../lib/trig';

  type Coordinate = { x: number; y: number };

  // TODO : Make fade into a prop

  let {
    from,
    to,
    lineWidth = 2,
    colour = 'black'
  }: { from: Coordinate; to: Coordinate; lineWidth?: number; colour?: string } = $props();

  const HEAD_LENGTH = 7;
  const HEAD_ANGLE = 45;
  const ROUNDING = 1;

  let d = $derived(distance(from, to));
  let uv = $derived(unitVector(from, to));
  let vertices = $derived(generateArrowPath(d, lineWidth, HEAD_ANGLE, HEAD_LENGTH, ROUNDING));
  let path = $derived(`${vertices.map(({ prefix, x, y }) => `${prefix} ${x} ${y}`).join('')} Z`);
  let rotation = $derived(Math.atan2(uv.y, uv.x) * (180 / Math.PI));
  $effect(() => {});
</script>

<path
  transition:fade
  d={path}
  transform-origin="left middle"
  style:stroke={colour}
  style:stroke-width="{lineWidth}px"
  style:transform="translate({to.x}px,{to.y}px) rotate({rotation}deg)"
/>
