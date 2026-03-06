import {
  curveCardinal,
  curveLinear,
  curveMonotoneX,
  curveStep,
  curveStepAfter,
  curveStepBefore,
  type CurveFactory
} from 'd3-shape';

export const curveMap: Record<string, CurveFactory> = {
  linear: curveLinear,
  cardinal: curveCardinal,
  step: curveStep,
  stepAfter: curveStepAfter,
  stepBefore: curveStepBefore,
  monotoneX: curveMonotoneX
} as const;

// The valibot library's picklist() function requires a tuple with at least one
// element but Object.keys(curveMap) is inferred as a generic string[]
export const curveTypes = Object.keys(curveMap) as [string, ...string[]];
