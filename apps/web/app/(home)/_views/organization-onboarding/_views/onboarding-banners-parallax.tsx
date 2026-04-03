'use client';

import { useEffect } from 'react';

const getBannersSection = (): HTMLElement | null =>
  document.querySelector<HTMLElement>(
    '[data-home-organization-onboarding-banners]'
  );

export const OnboardingBannersParallax = () => {
  useEffect(() => {
    let rafId: number | null = null;
    let disposeAnimations: (() => void) | undefined;
    let isMounted = true;
    let hasInitialized = false;

    const initialize = async () => {
      if (hasInitialized) return;
      hasInitialized = true;

      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);

        if (!isMounted) return;

        gsap.registerPlugin(ScrollTrigger);

        rafId = requestAnimationFrame(() => {
          if (!isMounted) return;

          const media = gsap.matchMedia();

          media.add(
            '(prefers-reduced-motion: no-preference) and (min-width: 768px)',
            () => {
              const section = getBannersSection();
              if (!section) return;

              const stage = section.querySelector<HTMLElement>(
                '[data-onboarding-banners-stage]'
              );

              const tourBanner =
                section.querySelector<HTMLElement>('[data-tour-banner]');
              const employeeBanner = section.querySelector<HTMLElement>(
                '[data-employee-banner]'
              );

              if (!tourBanner || !employeeBanner || !stage) return;

              gsap.set(employeeBanner, { yPercent: 100 });

              const stagePinTrigger = ScrollTrigger.create({
                trigger: stage,
                start: 'center center',
                endTrigger: section, //this is the container
                end: 'bottom center',
                pin: stage,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              });

              const employeeMotion = gsap.to(employeeBanner, {
                yPercent: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: stage,
                  start: 'center center',
                  // Finish overlap early so content is fully visible before section exits.
                  end: '+=30%',
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              });

              ScrollTrigger.refresh();

              return () => {
                employeeMotion.scrollTrigger?.kill();
                employeeMotion.kill();
                stagePinTrigger.kill();
                gsap.set(employeeBanner, { clearProps: 'transform' });
              };
            }
          );

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
