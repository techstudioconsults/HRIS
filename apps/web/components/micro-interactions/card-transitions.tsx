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

export const CardTransitions = () => {
  useGSAP(() => {
    // Create an empty context now so we have a stable reference for cleanup,
    // even though animations are registered lazily inside the idle callback.
    const ctx = gsap.context(() => {
      // Intentionally empty — populated via ctx.add() on idle.
    });

    const idleId = scheduleIdle(() => {
      // ctx.add() registers everything created inside into the existing context,
      // so ctx.revert() in the cleanup below will kill them all correctly.
      ctx.add(() => {
        const media = gsap.matchMedia();

        media.add('(prefers-reduced-motion: no-preference)', () => {
          const section = document.querySelector<HTMLElement>(
            '[data-home-products]'
          );

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
                animationTarget.querySelectorAll<SVGRectElement>('svg .rec-one')
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
    });

    return () => {
      // Cancel the idle callback if the component unmounts before it fires.
      cancelIdle(idleId);
      // Revert the context to kill all GSAP instances — whether already
      // created or registered via ctx.add() after the idle callback ran.
      ctx.revert();
    };
  });

  return null;
};
