'use client';

import { useEffect } from 'react';

export const HeaderEntrance = () => {
  useEffect(() => {
    let isMounted = true;
    let dispose: (() => void) | undefined;

    const init = async () => {
      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);

        if (!isMounted) return;

        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true });

        const media = gsap.matchMedia();

        media.add('(prefers-reduced-motion: no-preference)', () => {
          type HeaderAnimation = {
            tl: ReturnType<typeof gsap.timeline>;
            targets: HTMLElement[];
          };

          const headers = Array.from(
            document.querySelectorAll<HTMLElement>('[data-header-text]')
          );
          if (headers.length === 0) return;

          const animations = headers
            .map((header) => {
              const targets = Array.from(
                header.querySelectorAll<HTMLElement>('[data-h1]')
              );

              if (targets.length === 0) {
                return null;
              }

              gsap.set(targets, { y: header.clientHeight });

              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger: header,
                  start: 'top 100%',
                  once: true,
                  invalidateOnRefresh: true,
                },
              });

              tl.to(targets, {
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                stagger: targets.length > 1 ? 1.2 : 0,
              });

              return { tl, targets };
            })
            .filter(Boolean) as HeaderAnimation[];

          return () => {
            animations.forEach(({ tl, targets }) => {
              tl.scrollTrigger?.kill();
              tl.kill();
              gsap.set(targets, {
                clearProps: 'all',
              });
            });
          };
        });

        dispose = () => media.revert();
      } catch {
        // Keep the page fully interactive if GSAP fails.
      }
    };

    void init();

    return () => {
      isMounted = false;
      dispose?.();
    };
  }, []);

  return null;
};
