'use client';

import { ScrollSmoother, ScrollTrigger, useGSAP } from '../../lib/gsap/gsap';

const SMOOTH_SCROLL_CONFIG = {
  wrapper: '#smooth-wrapper',
  content: '#smooth-content',
  // Reduced from 2 → 1: a 2-second lerp lag meant ScrollTrigger fired at the
  // real scroll position while the viewport was visually 2 seconds behind,
  // causing jarring jumps when card animations kicked in.
  smooth: 1,
  // Removed normalizeScroll: true — it replaced native scroll with a
  // JS-driven handler on every pointer/wheel event, competing directly with
  // ScrollTrigger's own scroll-position reads and causing main-thread jank.
  effects: true,
  // Prevents repeated ScrollTrigger.refresh() calls triggered by the mobile
  // browser URL-bar resizing on every scroll, which compounds the jank.
  ignoreMobileResize: true,
} as const;

export const SmoothScrollInit = () => {
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const wrapper = document.querySelector<HTMLElement>(
      SMOOTH_SCROLL_CONFIG.wrapper
    );
    const content = document.querySelector<HTMLElement>(
      SMOOTH_SCROLL_CONFIG.content
    );

    if (!wrapper || !content) {
      return;
    }

    const existingSmoother = ScrollSmoother.get();

    if (existingSmoother) {
      existingSmoother.refresh();
      return;
    }

    const smoother = ScrollSmoother.create(SMOOTH_SCROLL_CONFIG);

    // ScrollSmoother repositions #smooth-content with a CSS transform after
    // creation. Any ScrollTrigger animations (e.g. card transitions) that
    // initialised before this point will have stale start/end positions.
    // refresh() recalculates all trigger positions against the new layout.
    ScrollTrigger.refresh();

    return () => {
      smoother.kill();
    };
  });

  return null;
};
