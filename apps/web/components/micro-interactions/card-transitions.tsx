'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createPayrollCardAnimation } from './payroll-card-animation';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const getSection = (): HTMLElement | null =>
  document.querySelector<HTMLElement>('[data-home-products]');

export const CardTransitions = () => {
  useGSAP(() => {
    let rafId = null;
    rafId = requestAnimationFrame(() => {
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
      return () => media.revert();
    });
    return () => cancelAnimationFrame(rafId);
  });

  return null;
};
