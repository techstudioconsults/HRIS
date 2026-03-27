'use client';

import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap/gsap';

const getPayrollProgressElements = (section: HTMLElement) => {
  const payrollFrame = section.querySelector<HTMLElement>('[data-product-animation-target="payroll-automation"]');
  const payrollSvg = payrollFrame?.querySelector<SVGElement>('svg');

  if (!payrollSvg) {
    return { progressBar: null, trackRect: null };
  }

  const rects = Array.from(payrollSvg.querySelectorAll<SVGRectElement>('rect'));
  const trackRect = rects.find((rect) => rect.getAttribute('fill') === '#f5f6f7') ?? null;
  const progressBar = rects.find((rect) => rect.getAttribute('fill') === '#0f973d') ?? null;

  return { progressBar, trackRect };
};

export const CardTransitions = () => {
  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const section = document.querySelector<HTMLElement>('[data-home-products]');

      if (!section) {
        return;
      }

      const { progressBar, trackRect } = getPayrollProgressElements(section);
      let progressTween: gsap.core.Tween | null = null;
      const initialProgressWidth = progressBar?.getAttribute('width') ?? null;

      if (progressBar) {
        const trackWidth = Number.parseFloat(trackRect?.getAttribute('width') ?? '0');
        const progressTargetWidth = trackWidth > 0 ? trackWidth * 0.4 : 40;

        gsap.set(progressBar, { attr: { width: 0 } });

        progressTween = gsap.to(progressBar, {
          delay: 1,
          attr: { width: progressTargetWidth },
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: progressBar.closest('[data-product-card]') ?? section,
            start: 'top 50%',
            invalidateOnRefresh: true,
            // once: true,
          },
        });
      }

      const refreshOnLoad = () => ScrollTrigger.refresh();
      if (document.readyState === 'complete') {
        refreshOnLoad();
      } else {
        window.addEventListener('load', refreshOnLoad, { once: true });
      }

      return () => {
        window.removeEventListener('load', refreshOnLoad);

        progressTween?.scrollTrigger?.kill();
        progressTween?.kill();

        if (progressBar) {
          if (initialProgressWidth !== null) {
            progressBar.setAttribute('width', initialProgressWidth);
          } else {
            progressBar.removeAttribute('width');
          }
        }
      };
    });

    return () => media.revert();
  });

  return null;
};
