'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createPayrollCardAnimation } from './payroll-card-animation';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Safari does not support requestIdleCallback — fall back to a zero-delay timeout.
const scheduleIdle = (cb: IdleRequestCallback): number =>
  typeof requestIdleCallback !== 'undefined'
    ? requestIdleCallback(cb)
    : (setTimeout(cb, 0) as unknown as number);

const cancelIdle = (id: number): void =>
  typeof cancelIdleCallback !== 'undefined'
    ? cancelIdleCallback(id)
    : clearTimeout(id);

const MAX_TARGET_SCAN_ATTEMPTS = 30;

const getSection = (): HTMLElement | null =>
  document.querySelector<HTMLElement>('[data-home-products]');

const hasAnimationRects = (section: HTMLElement): boolean =>
  Array.from(
    section.querySelectorAll<HTMLElement>('[data-product-animation-target]')
  ).some(
    (target) =>
      target.querySelectorAll<SVGRectElement>('svg .rec-one').length > 0
  );

export const CardTransitions = () => {
  useGSAP(() => {
    // Create an empty context now so we have a stable reference for cleanup,
    // even though animations are registered lazily inside the idle callback.
    const ctx = gsap.context(() => {
      // Intentionally empty — populated via ctx.add() on idle.
    });

    let rafId: number | null = null;

    const idleId = scheduleIdle(() => {
      // ctx.add() registers everything created inside into the existing context,
      // so ctx.revert() in the cleanup below will kill them all correctly.
      const runAnimations = () =>
        ctx.add(() => {
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

            const fades = animationTargets
              .map((animationTarget) => {
                const card =
                  animationTarget.closest<HTMLElement>('[data-product-card]') ??
                  animationTarget;
                const svgRects = Array.from(
                  animationTarget.querySelectorAll<SVGRectElement>(
                    'svg .rec-one'
                  )
                );
                if (svgRects.length === 0) return null;

                const isPayrollCard =
                  animationTarget.dataset.productAnimationTarget ===
                  'payroll-automation';

                return gsap.from(svgRects, {
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
              })
              .filter((fade): fade is gsap.core.Tween => fade !== null);

            // Ensure trigger positions are recalculated after lazy content settles.
            ScrollTrigger.refresh();

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

          return () => media.revert();
        });

      const scanForTargets = (attempt = 0) => {
        const section = getSection();

        if (section && hasAnimationRects(section)) {
          runAnimations();
          return;
        }

        if (attempt >= MAX_TARGET_SCAN_ATTEMPTS) {
          // Fallback: initialize anyway if lazy SVGs took longer than expected.
          runAnimations();
          return;
        }

        rafId = requestAnimationFrame(() => scanForTargets(attempt + 1));
      };

      scanForTargets();
    });

    return () => {
      // Cancel the idle callback if the component unmounts before it fires.
      cancelIdle(idleId);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      // Revert the context to kill all GSAP instances — whether already
      // created or registered via ctx.add() after the idle callback ran.
      ctx.revert();
    };
  });

  return null;
};
