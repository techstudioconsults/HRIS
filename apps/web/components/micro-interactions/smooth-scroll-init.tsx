'use client';

import { useEffect } from 'react';

const SMOOTH_SCROLL_CONFIG = {
  wrapper: '#smooth-wrapper',
  content: '#smooth-content',
  smooth: 1.2,
  speed: 1,
  effects: true,
  ignoreMobileResize: true,
} as const;

const shouldDisableSmoothScroll = () => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  return prefersReducedMotion || hasCoarsePointer;
};

export const SmoothScrollInit = () => {
  useEffect(() => {
    let mounted = true;
    let dispose: (() => void) | undefined;

    const init = async () => {
      if (shouldDisableSmoothScroll()) {
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

      try {
        const [{ gsap, ScrollTrigger, ScrollSmoother }] = await Promise.all([
          import('../../lib/gsap/gsap'),
        ]);

        if (!mounted) {
          return;
        }

        gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
        ScrollTrigger.config({ ignoreMobileResize: true });

        const existingSmoother = ScrollSmoother.get();
        if (existingSmoother) {
          existingSmoother.refresh();
          return;
        }

        const smoother = ScrollSmoother.create(SMOOTH_SCROLL_CONFIG);
        ScrollTrigger.refresh();

        dispose = () => {
          smoother.kill();
        };
      } catch {
        // Keep the page fully usable when GSAP smooth scrolling is unavailable.
      }
    };

    void init();

    return () => {
      mounted = false;
      dispose?.();
    };
  }, []);

  return null;
};
