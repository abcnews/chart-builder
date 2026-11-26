import { cubicInOut } from 'svelte/easing';
import type { PlotPadding } from './types';

export const PROJECT_NAME = 'chart-builder';
export const MARKER_NAME = 'chart';
export const MARKERS = [];

export const SCROLLY_OPENER_PREFIX = `#scrollytellerNAME${MARKER_NAME}CONFIG`;
export const SCROLLY_MARK_PREFIX = '#markCONFIG';

export const LARGE_TABLET_BREAKPOINT = 992;
export const DESKTOP_BREAKPOINT = 1500;
export const MOBILE_MAX = 462;

export const plotPadding: PlotPadding = {
  bottom: 30,
  left: 60,
  right: 10
};

export const defaultAxisLabelFormatStrings = {
  date: '%b. %Y',
  number: '~s'
};

export const ANIMATION_DURATION = 1000;
export const ANIMATION_EASING = cubicInOut;

export const fadeInOpts = { duration: 800, delay: 600 };
export const fadeOutOpts = { duration: 800, delay: 0 };