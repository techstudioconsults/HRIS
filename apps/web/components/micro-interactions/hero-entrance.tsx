'use client';

import { useEffect } from 'react';

export const HeroEntrance = () => {
  useEffect(() => {
    let isMounted = true;
    let dispose: (() => void) | undefined;

    const init = async () => {
      try {
        const { default: gsap } = await import('gsap');

        if (!isMounted) return;

        const media = gsap.matchMedia();

        media.add('(prefers-reduced-motion: no-preference)', () => {
          const hero = document.querySelector<HTMLElement>('[data-home-hero]');
          if (!hero) return;

          const items = Array.from(
            hero.querySelectorAll<HTMLElement>('[data-hero-item]')
          );
          const preview = hero.querySelector<HTMLElement>(
            '[data-hero-preview]'
          );

          if (items.length === 0 && !preview) return;

          // ── initial state ──────────────────────────────────────────
          gsap.set(items, { autoAlpha: 0, y: 28 });
          if (preview) gsap.set(preview, { autoAlpha: 0, y: 56, scale: 0.97 });

          // ── entrance timeline ──────────────────────────────────────
          const tl = gsap.timeline({ delay: 0.12 });

          if (items.length > 0) {
            tl.to(items, {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.12,
            });
          }

          if (preview) {
            tl.to(
              preview,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 1.0,
                ease: 'power3.out',
              },
              items.length > 0 ? '-=0.38' : 0
            );
          }

          return () => {
            tl.kill();
            gsap.set([...items, ...(preview ? [preview] : [])], {
              clearProps: 'all',
            });
          };
        });

        dispose = () => media.revert();
      } catch {
        // Keep the page fully interactive if GSAP fails.
      }
    };

    // Run immediately — no need to wait for full page load since the hero is
    // already in the initial viewport and all DOM nodes are present.
    void init();

    return () => {
      isMounted = false;
      dispose?.();
    };
  }, []);

  return null;
};
