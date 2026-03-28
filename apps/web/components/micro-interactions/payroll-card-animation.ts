import { gsap } from '../../lib/gsap/gsap';

interface PayrollCardAnimationOptions {
  card: HTMLElement;
  animationTarget: HTMLElement;
  fallbackTrigger: HTMLElement;
}

const normalizePathData = (pathData: string) =>
  pathData.trim().replace(/\s+/g, '').toLowerCase();

const CURRENT_FLOW_PATHS = new Set(
  [
    'M255.207 119v67.764h50.578',
    'M190.859 119.482v71.362h40.777v38.034',
    'M137.927 117.914v86.653h-36.466v36.858',
    'M100.677 118.307v50.188H47.352',
  ].map(normalizePathData)
);

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

  const rects = Array.from(payrollSvg.querySelectorAll<SVGRectElement>('rect'));
  const trackRect =
    rects.find((rect) => rect.getAttribute('fill') === '#f5f6f7') ?? null;
  const progressBar =
    rects.find((rect) => rect.getAttribute('fill') === '#0f973d') ?? null;
  const currentFlowPaths = getCurrentFlowPaths(payrollSvg);

  return { progressBar, trackRect, payrollSvg, currentFlowPaths };
};

export const createPayrollCardAnimation = ({
  card,
  animationTarget,
  fallbackTrigger,
}: PayrollCardAnimationOptions) => {
  const triggerElement = card ?? fallbackTrigger;
  const { progressBar, trackRect, payrollSvg, currentFlowPaths } =
    getPayrollProgressElements(animationTarget);
  let progressTween: gsap.core.Tween | null = null;
  let flowTween: gsap.core.Tween | null = null;
  const initialProgressWidth = progressBar?.getAttribute('width') ?? null;
  const flowMarkers: Array<{
    marker: SVGCircleElement;
    path: SVGPathElement;
    totalLength: number;
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

    const updateMarkers = () => {
      flowMarkers.forEach(({ marker, path, totalLength }) => {
        const point = path.getPointAtLength(totalLength * flowState.progress);
        marker.setAttribute('cx', String(point.x));
        marker.setAttribute('cy', String(point.y));
      });
    };

    currentFlowPaths.forEach((path) => {
      const marker = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      );
      const totalLength = path.getTotalLength();
      const startPoint = path.getPointAtLength(0);

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

      flowMarkers.push({ marker, path, totalLength });
    });

    updateMarkers();

    flowTween = gsap.to(flowState, {
      progress: 1,
      duration: 2.5,
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

    progressTween = gsap.to(progressBar, {
      delay: 1,
      // immediateRender: true,
      attr: { width: progressTargetWidth },
      duration: 1.5,
      ease: 'power2.out',
      onStart: startCurrentFlowAnimation,
      scrollTrigger: {
        trigger: triggerElement,
        start: 'top 50%',
        invalidateOnRefresh: true,
      },
    });
  } else {
    startCurrentFlowAnimation();
  }

  return () => {
    progressTween?.scrollTrigger?.kill();
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
