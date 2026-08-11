<script lang="ts">
  import { getContext } from 'svelte';
  import { area, curveCardinal, type CurveFactory } from 'd3-shape';
  import { type LayerCakeContextType } from '../../lib/types';

  interface Props {
    idA: string;
    idB: string;
    curve?: CurveFactory;
    fill?: string;
    opacity?: number;
  }

  const { data, xScale, yScale } = getContext<LayerCakeContextType>('LayerCake');

  let { idA, idB, curve, fill = '#888', opacity = 0.3 }: Props = $props();

  const merged = $derived.by(() => {
    const seriesA = $data.find(d => d.config.id === idA)?.values ?? [];
    const seriesB = $data.find(d => d.config.id === idB)?.values ?? [];

    return seriesA.flatMap((d, i) => {
      const yA = d.y;
      const yB = seriesB[i]?.y;
      const x = d.x;

      if (typeof yA !== 'number' || typeof yB !== 'number') return [];
      if (!(x instanceof Date) && typeof x !== 'number') return [];

      return [
        {
          x,
          y0: Math.min(yA, yB),
          y1: Math.max(yA, yB)
        }
      ];
    });
  });

  const areaGen = $derived(
    area<{ x: number | Date; y0: number; y1: number }>()
      .x(d => $xScale(d.x as any))
      .y0(d => $yScale(d.y0))
      .y1(d => $yScale(d.y1))
      .curve(curve || curveCardinal)
  );

  const pathD = $derived(merged.length > 0 ? areaGen(merged) : '');
</script>

<g class="area-diff">
  <path class="path-area" d={pathD} {fill} style:fill-opacity={opacity}></path>
</g>

<style>
  .path-area {
    stroke: none;
    /*mix-blend-mode: multiply;*/
  }
</style>
