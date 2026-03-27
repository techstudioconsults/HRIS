'use client';

import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap/gsap';

const normalizePathData = (pathData: string) => pathData.trim().replace(/\s+/g, '').toLowerCase();

const CURRENT_FLOW_PATHS = new Set(
  [
    'M255.207 119v67.764h50.578',
    'M190.859 119.482v71.362h40.777v38.034',
    'M137.927 117.914v86.653h-36.466v36.858',
    'M100.677 118.307v50.188H47.352',
  ].map(normalizePathData)
);

const getCurrentFlowPaths = (payrollSvg: SVGElement) => {
  const paths = Array.from(payrollSvg.querySelectorAll<SVGPathElement>('path'));
  const strokedFlowPaths = paths.filter((path) => path.getAttribute('stroke')?.toLowerCase() === '#ebe6e6');
  const strictMatches = strokedFlowPaths.filter((path) => {
    const pathData = path.getAttribute('d');
    return pathData ? CURRENT_FLOW_PATHS.has(normalizePathData(pathData)) : false;
  });

  // Fallback to the stroked flow paths if the SVG path string formatting changed.
  return strictMatches.length > 0 ? strictMatches : strokedFlowPaths.slice(0, 4);
};

const getPayrollProgressElements = (section: HTMLElement) => {
  const payrollFrame = section.querySelector<HTMLElement>('[data-product-animation-target="payroll-automation"]');
  const payrollSvg = payrollFrame?.querySelector<SVGElement>('svg');

  if (!payrollSvg) {
    return { progressBar: null, trackRect: null, payrollSvg: null, currentFlowPaths: [] as SVGPathElement[] };
  }

  const rects = Array.from(payrollSvg.querySelectorAll<SVGRectElement>('rect'));
  const trackRect = rects.find((rect) => rect.getAttribute('fill') === '#f5f6f7') ?? null;
  const progressBar = rects.find((rect) => rect.getAttribute('fill') === '#0f973d') ?? null;
  const currentFlowPaths = getCurrentFlowPaths(payrollSvg);

  return { progressBar, trackRect, payrollSvg, currentFlowPaths };
};

export const CardTransitions = () => {
  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const section = document.querySelector<HTMLElement>('[data-home-products]');

      if (!section) {
        return;
      }

      const { progressBar, trackRect, payrollSvg, currentFlowPaths } = getPayrollProgressElements(section);
      let progressTween: gsap.core.Tween | null = null;
      const initialProgressWidth = progressBar?.getAttribute('width') ?? null;
      const flowMarkers: SVGCircleElement[] = [];
      const flowTweens: gsap.core.Tween[] = [];

      const startCurrentFlowAnimation = () => {
        if (!payrollSvg || currentFlowPaths.length === 0 || flowTweens.length > 0) {
          return;
        }

        currentFlowPaths.forEach((path, index) => {
          const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          const startPoint = path.getPointAtLength(0);

          marker.setAttribute('r', '2.5');
          marker.setAttribute('fill', '#0f973d');
          marker.setAttribute('stroke', '#ffffff');
          marker.setAttribute('stroke-width', '0.75');
          marker.setAttribute('cx', String(startPoint.x));
          marker.setAttribute('cy', String(startPoint.y));
          marker.setAttribute('opacity', '0.95');
          payrollSvg.append(marker);

          const tween = gsap.to(marker, {
            duration: 2.5,
            ease: 'none',
            repeat: -1,
            // delay: index * 0.2,
            motionPath: {
              path,
              align: path,
              alignOrigin: [0.5, 0.5],
            },
          });

          flowMarkers.push(marker);
          flowTweens.push(tween);
        });
      };

      if (progressBar) {
        const trackWidth = Number.parseFloat(trackRect?.getAttribute('width') ?? '0');
        const progressTargetWidth = trackWidth > 0 ? trackWidth * 0.4 : 40;

        gsap.set(progressBar, { attr: { width: 0 } });

        progressTween = gsap.to(progressBar, {
          delay: 1,
          attr: { width: progressTargetWidth },
          duration: 1.5,
          ease: 'power2.out',
          onComplete: startCurrentFlowAnimation,
          scrollTrigger: {
            trigger: progressBar.closest('[data-product-card]') ?? section,
            start: 'top 50%',
            onEnter: startCurrentFlowAnimation,
            onEnterBack: startCurrentFlowAnimation,
            invalidateOnRefresh: true,
            // once: true,
          },
        });
      } else {
        startCurrentFlowAnimation();
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
        flowTweens.forEach((tween) => tween.kill());
        flowMarkers.forEach((marker) => marker.remove());

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
