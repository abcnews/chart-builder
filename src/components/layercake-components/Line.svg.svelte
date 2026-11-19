<svelte:options namespace="svg" />

<script lang="ts">
  import { prefersReducedMotion } from '@abcnews/env-utils';
  import { curveCardinal, line, type CurveFactory } from 'd3-shape';
  import { Tween } from 'svelte/motion';
  import type { LayerCakeGroupedDataGroupValuesType } from '../../lib/types';
  import { type ScaleLinear } from 'd3-scale';
  import { ANIMATION_DURATION, ANIMATION_EASING, fadeInOpts, fadeOutOpts } from '../../lib/constants';
  import { fade } from 'svelte/transition';

  interface Props {
    stroke: string;
    dasharray?: string;
    curve?: CurveFactory;
    data: LayerCakeGroupedDataGroupValuesType[];
    xScale: ScaleLinear<number | Date, number>;
    yScale: ScaleLinear<number | Date, number>;
  }

  let { stroke, dasharray, curve = curveCardinal, data, xScale, yScale }: Props = $props();

  const tween = Tween.of(
    () => {
      return data.map(d => {
        if ((typeof d.x === 'number' || d.x instanceof Date) && (typeof d.y === 'number' || d.y instanceof Date)) {
          const res: [number, number] = [xScale(d.x), yScale(d.y)];
          return res;
        }
        throw new Error(`Bad data ${JSON.stringify({ x: d.x, y: d.y })} passed to Line component`);
      });
    },
    {
      duration: $prefersReducedMotion ? 100 : ANIMATION_DURATION,
      easing: ANIMATION_EASING
    }
  );

  const lineGenerator = $derived(line().curve(curve));
  const path = $derived(lineGenerator(tween.current));
</script>

<g in:fade={fadeInOpts} out:fade={fadeOutOpts} class="line" style:--line-dasharray={dasharray ? dasharray : undefined}>
  <path class="path-line outline" d={path}></path>
  <path class="path-line" d={path} {stroke}></path>
</g>

<style>
  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2px;
    stroke-dasharray: var(--line-dasharray, none);

    &.outline {
      stroke-width: 3px;
      stroke: #fff;
    }
  }
</style>
