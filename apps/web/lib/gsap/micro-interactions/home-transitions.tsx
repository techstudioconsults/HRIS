'use client';

import { gsap, useGSAP } from '../gsap';

export const HomeTransitions = () => {
  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const productsSection = document.querySelector<HTMLElement>('[data-home-products]');
      if (!productsSection) {
        return;
      }

      gsap.set(productsSection, { willChange: 'transform, opacity' });
      const tween = gsap.fromTo(
        productsSection,
        {
          y: 56,
          autoAlpha: 0.94,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: productsSection,
            start: 'top 92%',
            end: 'top 68%',
            scrub: 0.8,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
          onComplete: () => {
            // Clear will-change after animation completes for better performance
            gsap.set(productsSection, { clearProps: 'willChange' });
          },
        }
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        // Ensure cleanup of all animation properties set by GSAP
        gsap.set(productsSection, { clearProps: 'all' });
      };
    });

    return () => media.revert();
  });

  return null;
};
