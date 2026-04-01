'use client';

import { useEffect } from 'react';

// Tune this value to control how far down the morphed logo sits (0 disables extra shift).
const LOGO_VERTICAL_OFFSET_RATIO = 0.25;

export const FooterSvgMorph = () => {
  useEffect(() => {
    let isMounted = true;
    let dispose: (() => void) | undefined;

    const init = async () => {
      try {
        const [{ default: gsap }, { MorphSVGPlugin }] = await Promise.all([
          import('gsap'),
          import('gsap/MorphSVGPlugin'),
        ]);

        if (!isMounted) return;

        gsap.registerPlugin(MorphSVGPlugin);

        const media = gsap.matchMedia();

        media.add('(prefers-reduced-motion: no-preference)', () => {
          const stage = document.querySelector<HTMLElement>(
            '[data-footer-svg-stage]'
          );
          if (!stage) return;

          const cityPaths = Array.from(
            stage.querySelectorAll<SVGPathElement>('#lagos-city path')
          );
          const cityMainPath = cityPaths[0];
          const cityAccentPaths = cityPaths.slice(1);
          const logoPath = stage.querySelector<SVGPathElement>('#footer-logo');

          MorphSVGPlugin.equalizeSegmentQuantity(
            cityMainPath,
            logoPath,
            'auto'
          );

          if (!cityMainPath || !logoPath) return;

          const sourceBox = cityMainPath.getBBox();
          const targetBox = logoPath.getBBox();
          const sourceCenterX = sourceBox.x + sourceBox.width / 2;
          const sourceCenterY = sourceBox.y + sourceBox.height / 2;
          const targetCenterX = targetBox.x + targetBox.width / 2;
          const targetCenterY = targetBox.y + targetBox.height / 2;
          const driftCompensationX = sourceCenterX - targetCenterX;
          const driftCompensationY = sourceCenterY - targetCenterY;
          const logoVerticalOffsetY =
            targetBox.height * LOGO_VERTICAL_OFFSET_RATIO;

          // Keep the target in DOM for MorphSVGPlugin, but hide it visually.
          gsap.set(logoPath, { autoAlpha: 0 });
          gsap.set(cityMainPath, {
            x: 0,
            y: 0,
            transformBox: 'fill-box',
            transformOrigin: '50% 50%',
          });

          const tl = gsap.timeline({ paused: true, repeat: -1, yoyo: true });

          if (cityAccentPaths.length > 0) {
            tl.to(cityAccentPaths, {
              autoAlpha: 0,
              duration: 1,
              ease: 'power1.out',
            });
          }

          tl.to(cityMainPath, {
            morphSVG: {
              shape: logoPath,
              map: 'complexity',
              type: 'rotational',
              origin: '0% 0%',
              // @ts-ignore
              curveMode: true,
              smooth: {
                redraw: false, // perfect shape fidelity, but less even spacing
                persist: false, // remove smoothing points when animation completes
              },
            },
            x: driftCompensationX,
            y: driftCompensationY + logoVerticalOffsetY,
            duration: 5,
            ease: 'power2.inOut',
          });

          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry?.isIntersecting) {
                tl.play();
                return;
              }
              tl.pause();
            },
            {
              threshold: 0.15,
            }
          );
          observer.observe(stage);

          return () => {
            observer.disconnect();
            tl.kill();
            gsap.set(logoPath, { clearProps: 'all' });
            gsap.set(cityPaths, { clearProps: 'all' });
          };
        });

        dispose = () => media.revert();
      } catch {
        // Keep static SVG rendering if GSAP plugin loading fails.
      }
    };

    void init();

    return () => {
      isMounted = false;
      dispose?.();
    };
  }, []);

  // Pure behavioural component — renders nothing.
  return null;
};
