'use client';

import { ScrollSmoother, useGSAP } from '../../lib/gsap/gsap';

const SMOOTH_SCROLL_CONFIG = {
  wrapper: '#smooth-wrapper',
  content: '#smooth-content',
  smooth: 1,
  normalizeScroll: true,
  effects: true,
} as const;

export const SmoothScrollInit = () => {
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const wrapper = document.querySelector<HTMLElement>(SMOOTH_SCROLL_CONFIG.wrapper);
    const content = document.querySelector<HTMLElement>(SMOOTH_SCROLL_CONFIG.content);

    if (!wrapper || !content) {
      return;
    }

    const existingSmoother = ScrollSmoother.get();

    if (existingSmoother) {
      existingSmoother.refresh();
      return;
    }

    const smoother = ScrollSmoother.create(SMOOTH_SCROLL_CONFIG);

    return () => {
      smoother.kill();
    };
  });

  return null;
};
