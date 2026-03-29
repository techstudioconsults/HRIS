// gsap is passed in as a parameter — no static import so this module stays
// out of the initial bundle and is only loaded via the dynamic import in
// card-transitions.tsx (true lazy-loading).
type GsapInstance = typeof import('gsap').default;

interface PayrollCardAnimationOptions {
  animationTarget: HTMLElement;
  /** The lazily-loaded gsap instance (passed from card-transitions.tsx). */
  gsap: GsapInstance;
}

/**
 * Number of points to pre-sample per path.
 * 120 points gives sub-pixel accuracy at 60 fps over a 2-second loop
 * (each frame advances ~0.008 of progress, so we get ~1 sample per frame).
 */
const PATH_SAMPLE_COUNT = 120;

/** Pre-sample an SVG path into an array of {x, y} points.
 *  This is called ONCE at animation setup time, converting N future
 *  layout-forcing `getPointAtLength` calls into a single O(n) batch,
 *  after which per-frame updates become a plain array lookup with no
 *  DOM/layout interaction at all. */
const samplePathPoints = (
  path: SVGPathElement,
  totalLength: number
): Array<{ x: number; y: number }> => {
  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= PATH_SAMPLE_COUNT; i++) {
    const pt = path.getPointAtLength((i / PATH_SAMPLE_COUNT) * totalLength);
    points.push({ x: pt.x, y: pt.y });
  }
  return points;
};

const getCurrentFlowPaths = (payrollSvg: SVGElement) => {
  return Array.from(
    payrollSvg.querySelectorAll<SVGPathElement>('.current-line')
  );
};

const getPayrollProgressElements = (animationTarget: HTMLElement) => {
  const payrollSvg = animationTarget.querySelector<SVGElement>('svg');

  if (!payrollSvg) {
    return {
      progressBar: null,
      trackRect: null,
      payrollSvg: null,
      currentFlowPaths: [] as SVGPathElement[],
    };
  }

  const trackRect = payrollSvg.querySelector(`#payroll-progress-track`);
  const progressBar = payrollSvg.querySelector(`#payroll-progress-bar`);
  const currentFlowPaths = getCurrentFlowPaths(payrollSvg);

  return { progressBar, trackRect, payrollSvg, currentFlowPaths };
};

export const createPayrollCardAnimation = ({
  animationTarget,
  gsap,
}: PayrollCardAnimationOptions) => {
  const { progressBar, trackRect, payrollSvg, currentFlowPaths } =
    getPayrollProgressElements(animationTarget);
  let progressTween: gsap.core.Tween | null = null;
  let flowTween: gsap.core.Tween | null = null;
  const initialProgressWidth = progressBar?.getAttribute('width') ?? null;
  // Stores pre-sampled point arrays — no live DOM queries per animation frame.
  const flowMarkers: Array<{
    marker: SVGCircleElement;
    sampledPoints: Array<{ x: number; y: number }>;
  }> = [];

  const startCurrentFlowAnimation = () => {
    if (!payrollSvg || currentFlowPaths.length === 0 || flowTween) {
      return;
    }

    // Insert markers before card/avatar layers so overlaps render above markers.
    const markerInsertionTarget =
      payrollSvg.querySelector<SVGGraphicsElement>('rect, circle');
    const markerLayerParent =
      markerInsertionTarget?.parentNode instanceof SVGElement
        ? markerInsertionTarget.parentNode
        : payrollSvg;

    const flowState = { progress: 0 };

    // O(1) array lookup per frame — no layout-forcing DOM queries at all.
    const updateMarkers = () => {
      flowMarkers.forEach(({ marker, sampledPoints }) => {
        const idx = Math.min(
          Math.round(flowState.progress * PATH_SAMPLE_COUNT),
          PATH_SAMPLE_COUNT
        );
        const point = sampledPoints[idx];
        marker.setAttribute('cx', String(point.x));
        marker.setAttribute('cy', String(point.y));
      });
    };

    currentFlowPaths.forEach((path) => {
      // iOS Safari bug: getTotalLength() returns 0 for paths that haven't
      // been painted yet. Force a reflow via getBoundingClientRect() first,
      // which flushes layout and ensures the path geometry is available.
      void path.getBoundingClientRect();
      const totalLength = path.getTotalLength();

      // Skip paths that are still unresolvable after the reflow (e.g. hidden).
      if (totalLength === 0) return;

      const marker = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      );
      // Sample the path once — all future per-frame updates are array lookups.
      const sampledPoints = samplePathPoints(path, totalLength);
      const startPoint = sampledPoints[0];

      marker.setAttribute('r', '2.5');
      marker.setAttribute('fill', '#0f973d');
      marker.setAttribute('stroke', '#ffffff');
      marker.setAttribute('stroke-width', '0.75');
      marker.setAttribute('cx', String(startPoint.x));
      marker.setAttribute('cy', String(startPoint.y));
      marker.setAttribute('opacity', '0.95');
      // insertBefore requires the reference node to be a child of the same parent.
      if (
        markerInsertionTarget &&
        markerInsertionTarget.parentNode === markerLayerParent
      ) {
        markerLayerParent.insertBefore(marker, markerInsertionTarget);
      } else {
        markerLayerParent.append(marker);
      }

      flowMarkers.push({ marker, sampledPoints });
    });

    // If all paths had zero length (e.g. SVG not yet visible on iOS) bail out.
    if (flowMarkers.length === 0) return;

    updateMarkers();

    flowTween = gsap.to(flowState, {
      progress: 1,
      duration: 1,
      ease: 'none',
      repeat: -1,
      onUpdate: updateMarkers,
    });
  };

  if (progressBar) {
    const trackWidth = Number.parseFloat(
      trackRect?.getAttribute('width') ?? '0'
    );
    const progressTargetWidth = trackWidth > 0 ? trackWidth * 0.4 : 40;

    gsap.set(progressBar, { attr: { width: 0 } });

    // No nested scrollTrigger here — this function is always called from
    // inside an onComplete of a scroll-triggered fade, so the element is
    // already in the viewport. A nested scrollTrigger reliably fails to fire
    // on iOS WebKit because it cannot detect the current scroll position when
    // a new trigger is created inside an animation callback.
    progressTween = gsap.to(progressBar, {
      attr: { width: progressTargetWidth },
      duration: 1.5,
      ease: 'power2.out',
      delay: 0.1,
      onComplete: startCurrentFlowAnimation,
    });
  } else {
    startCurrentFlowAnimation();
  }

  return () => {
    progressTween?.kill();
    flowTween?.kill();
    flowMarkers.forEach(({ marker }) => marker.remove());

    if (progressBar) {
      if (initialProgressWidth !== null) {
        progressBar.setAttribute('width', initialProgressWidth);
      } else {
        progressBar.removeAttribute('width');
      }
    }
  };
};
