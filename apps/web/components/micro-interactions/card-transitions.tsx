'use client';

import { useEffect } from 'react';

const getSection = (): HTMLElement | null =>
  document.querySelector<HTMLElement>('[data-home-products]');

export const CardTransitions = () => {
  useEffect(() => {
    let rafId: number | null = null;
    let disposeAnimations: (() => void) | undefined;
    let isMounted = true;
    let hasInitialized = false;

    const initialize = async () => {
      if (hasInitialized) return;
      hasInitialized = true;

      try {
        const [{ gsap, ScrollTrigger }, { createPayrollCardAnimation }] =
          await Promise.all([
            import('../../lib/gsap/gsap'),
            import('./payroll-card-animation'),
          ]);

        if (!isMounted) return;

        rafId = requestAnimationFrame(() => {
          if (!isMounted) return;

          const media = gsap.matchMedia();

          media.add('(prefers-reduced-motion: no-preference)', () => {
            const section = getSection();
            if (!section) return;

            const animationTargets = Array.from(
              section.querySelectorAll<HTMLElement>(
                '[data-product-animation-target]'
              )
            );
            const payrollAnimationCleanups: Array<() => void> = [];
            const fades = animationTargets.reduce<
              Array<ReturnType<typeof gsap.from>>
            >((acc, animationTarget) => {
              const card =
                animationTarget.closest<HTMLElement>('[data-product-card]') ??
                animationTarget;
              const svgRects = Array.from(
                animationTarget.querySelectorAll<SVGRectElement>('svg .rec-one')
              );
              if (svgRects.length === 0) return acc;

              const isPayrollCard =
                animationTarget.dataset.productAnimationTarget ===
                'payroll-automation';

              const fade = gsap.from(svgRects, {
                autoAlpha: 0,
                y: 14,
                duration: 1,
                ease: 'power2.out',
                stagger: 0.5,
                onComplete: isPayrollCard
                  ? () => {
                      const cleanup = createPayrollCardAnimation({
                        card,
                        animationTarget,
                        fallbackTrigger: section,
                      });
                      payrollAnimationCleanups.push(cleanup);
                    }
                  : undefined,
                scrollTrigger: {
                  trigger: card,
                  start: 'top 90%',
                  once: true,
                  invalidateOnRefresh: true,
                },
              });

              acc.push(fade);
              return acc;
            }, []);

            if (fades.length > 0) {
              ScrollTrigger.refresh();
            }

            return () => {
              fades.forEach((fade) => {
                fade.scrollTrigger?.kill();
                fade.kill();
              });
              payrollAnimationCleanups.forEach((cleanup) => cleanup());
              const allSvgRects = animationTargets.flatMap((target) =>
                Array.from(target.querySelectorAll<SVGRectElement>('svg rect'))
              );
              gsap.set(allSvgRects, {
                clearProps: 'x,y,opacity,visibility,transform',
              });
            };
          });

          disposeAnimations = () => {
            media.revert();
          };
        });
      } catch {
        // Ignore animation bootstrap failures to keep UI interactive.
      }
    };

    const startWhenStable = () => {
      void initialize();
    };

    if (document.readyState === 'complete') {
      startWhenStable();
    } else {
      window.addEventListener('load', startWhenStable, { once: true });
    }

    return () => {
      isMounted = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('load', startWhenStable);
      disposeAnimations?.();
    };
  }, []);

  return null;
};
