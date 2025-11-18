/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FC,
  type ReactNode,
} from "react";

interface UseWaveAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  staggerDelay?: number;
  duration?: number;
}

export const useWaveAnimation = (options: UseWaveAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = "50px", staggerDelay = 50, duration = 500 } = options;

  const [isVisible, setIsVisible] = useState(false);
  const containerReference = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin },
    );

    if (containerReference.current) {
      const checkVisibility = () => {
        if (!containerReference.current) return;

        const rect = containerReference.current.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;

        if (inView) {
          window.setTimeout(() => setIsVisible(true), 150);
        } else {
          observer.observe(containerReference.current);
        }
      };

      const id = window.setTimeout(checkVisibility, 50);
      return () => {
        window.clearTimeout(id);
        observer.disconnect();
      };
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const getItemStyle = useMemo(
    () =>
      (index: number): CSSProperties => ({
        transitionDelay: `${index * staggerDelay}ms`,
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        willChange: "transform, opacity",
      }),
    [staggerDelay, duration],
  );

  const getItemClassName = (baseClasses = "") =>
    cn(
      baseClasses,
      "transition-all transform",
      isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95",
    );

  return {
    isVisible,
    containerReference,
    getItemStyle,
    getItemClassName,
  };
};

// =========================================================

interface AnimationContextType {
  getItemStyle: (index: number) => CSSProperties;
  getItemClassName: (baseClasses?: string) => string;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

interface PageWrapperProperties extends UseWaveAnimationOptions {
  children: ReactNode;
  className?: string;
}

export const PageWrapper: FC<PageWrapperProperties> = ({
  children,
  className,
  staggerDelay = 50,
  duration = 600,
  threshold,
  rootMargin,
}) => {
  const { containerReference, getItemStyle, getItemClassName } = useWaveAnimation({
    staggerDelay,
    duration,
    threshold,
    rootMargin,
  });

  return (
    <AnimationContext.Provider value={{ getItemStyle, getItemClassName }}>
      <div ref={containerReference} className={cn(className)}>
        {children}
      </div>
    </AnimationContext.Provider>
  );
};

interface PageSectionProperties {
  children: ReactNode;
  index: number;
  className?: string;
}

export const PageSection: FC<PageSectionProperties> = ({ children, index, className }) => {
  const context = useContext(AnimationContext);

  if (!context) {
    throw new Error("PageSection must be used within a PageWrapper");
  }

  const { getItemStyle, getItemClassName } = context;

  return (
    <div style={getItemStyle(index)} className={getItemClassName(className)}>
      {children}
    </div>
  );
};

// =========================================================
// PageTransition – flexible, reusable Next.js App Router page transitions

type PageTransitionVariant = "none" | "fade" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale" | "wipe";

interface PageTransitionProperties {
  children: ReactNode;
  className?: string;
  duration?: number; // ms
  easing?: string; // CSS timing function
  variant?: PageTransitionVariant;
  overlayColor?: string; // used when variant="wipe"
  disabled?: boolean;
  initial?: boolean; // animate on first mount
  blur?: number; // px blur on overlay (wipe)
  onStart?: () => void;
  onEnd?: () => void;
}

const DEFAULT_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setPrefers(media.matches);
    update();

    if ("addEventListener" in media) {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    if ("addListener" in media && typeof (media as any).addListener === "function") {
      const m = media as any;
      m.addListener(update);
      return () => m.removeListener(update);
    }
  }, []);

  return prefers;
}

function getEnterFromStyle(variant: PageTransitionVariant): CSSProperties {
  switch (variant) {
    case "fade": {
      return { opacity: 0, transform: "none" };
    }
    case "slideUp": {
      return { opacity: 0, transform: "translateY(16px)" };
    }
    case "slideDown": {
      return { opacity: 0, transform: "translateY(-16px)" };
    }
    case "slideLeft": {
      return { opacity: 0, transform: "translateX(16px)" };
    }
    case "slideRight": {
      return { opacity: 0, transform: "translateX(-16px)" };
    }
    case "scale": {
      return { opacity: 0, transform: "scale(0.98)" };
    }
    case "wipe": {
      // Wipe uses overlay; content itself can softly fade in
      return { opacity: 0, transform: "none" };
    }
    default: {
      return { opacity: 1, transform: "none" };
    }
  }
}

function getEnterToStyle(): CSSProperties {
  return { opacity: 1, transform: "none" };
}

/**
 * PageTransition
 * - Drop-in wrapper that animates page entries on route changes
 * - Variants: "fade", "slide{Up,Down,Left,Right}", "scale", "wipe", "none"
 * - Works with Next.js App Router. No external deps.
 *
 * Usage:
 *   In app/layout.tsx:
 *     <PageTransition variant="wipe" duration={700}>{children}</PageTransition>
 */
export const PageTransition: FC<PageTransitionProperties> = ({
  children,
  className,
  duration = 600,
  easing = DEFAULT_EASING,
  variant = "fade",
  overlayColor = "var(--background)",
  disabled = false,
  initial = true,
  blur = 0,
  onStart,
  onEnd,
}) => {
  const pathname = usePathname();
  const prefersReduced = usePrefersReducedMotion();

  const [enterStyle, setEnterStyle] = useState<CSSProperties>({});
  const [animateKey, setAnimateKey] = useState(0);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayTransform, setOverlayTransform] = useState<string>("translateX(-100%)");

  const hasMountedReference = useRef(false);

  const runOverlay = useMemo(() => {
    return () => {
      if (variant !== "wipe") return;
      if (prefersReduced || disabled) return;

      setOverlayVisible(true);
      setOverlayTransform("translateX(-100%)");

      requestAnimationFrame(() => {
        setOverlayTransform("translateX(0)");
      });

      const half = Math.max(1, Math.floor(duration / 2));

      window.setTimeout(() => {
        setOverlayTransform("translateX(100%)");
      }, half);

      window.setTimeout(() => {
        setOverlayVisible(false);
        setOverlayTransform("translateX(-100%)");
      }, duration + 50);
    };
  }, [variant, duration, prefersReduced, disabled]);

  const triggerEnter = useMemo(() => {
    return () => {
      if (disabled || prefersReduced) {
        setEnterStyle(getEnterToStyle());
        return;
      }

      onStart?.();

      const contentVariant = variant === "wipe" ? "fade" : variant;

      const from = getEnterFromStyle(contentVariant);
      const to = getEnterToStyle();

      setEnterStyle({
        ...from,
        transition: `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`,
        willChange: "opacity, transform",
      });

      requestAnimationFrame(() => {
        setAnimateKey((key) => key + 1);
        setEnterStyle((previous) => ({
          ...previous,
          ...to,
        }));
      });

      if (variant === "wipe") {
        runOverlay();
      }

      window.setTimeout(() => {
        onEnd?.();
      }, duration + 60);
    };
  }, [disabled, prefersReduced, duration, easing, variant, runOverlay, onStart, onEnd]);

  useEffect(() => {
    if (!hasMountedReference.current) {
      hasMountedReference.current = true;
      if (initial) {
        triggerEnter();
      } else {
        setEnterStyle(getEnterToStyle());
      }
      return;
    }
    triggerEnter();
  }, [pathname, initial, triggerEnter]);

  const containerStyle: CSSProperties = prefersReduced || disabled ? {} : enterStyle;

  return (
    <div key={animateKey} className={cn("relative", className)} style={containerStyle}>
      {children}

      {overlayVisible && variant === "wipe" ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0"
          style={{
            backgroundColor: overlayColor,
            transform: overlayTransform,
            transition: `transform ${Math.max(1, Math.floor(duration / 2))}ms ${easing}`,
            zIndex: 60,
            backdropFilter: blur ? `blur(${blur}px)` : undefined,
            WebkitBackdropFilter: blur ? `blur(${blur}px)` : undefined,
          }}
        />
      ) : null}
    </div>
  );
};
