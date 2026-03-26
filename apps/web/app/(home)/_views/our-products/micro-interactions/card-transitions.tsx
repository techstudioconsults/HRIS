'use client';

import { gsap, ScrollTrigger, useGSAP } from '../../../../../lib/gsap/gsap';

// Resolves the inner SVG (preferred float target) from an image frame element.
const svgOf = (frame: HTMLElement): Element => frame.querySelector<SVGElement>('svg') ?? frame;

export const CardTransitions = () => {
  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const section = document.querySelector<HTMLElement>('[data-home-products]');
      const imageFrames = gsap.utils.toArray<HTMLElement>('[data-product-animation-target]');
      const cards = gsap.utils.toArray<HTMLElement>('[data-product-card]');

      if (!section || imageFrames.length === 0) return;

      // ─── 1. Lock initial hidden state for every card ─────────────────────
      imageFrames.forEach((frame) => {
        gsap.set(frame, { autoAlpha: 0, y: 24, scale: 0.985, willChange: 'transform, opacity' });
        gsap.set(svgOf(frame), { yPercent: 5, filter: 'blur(3px)', willChange: 'transform, filter' });
      });

      // ─── 2. Staggered entrance timeline ──────────────────────────────────
      const entranceTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          invalidateOnRefresh: true,
          once: true,
        },
        onComplete() {
          imageFrames.forEach((frame) => {
            gsap.set([frame, svgOf(frame)], { clearProps: 'willChange,filter' });
          });
        },
      });

      // Card frames slide up and fade in with a stagger.
      entranceTimeline.to(imageFrames, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.65,
        ease: 'power2.out',
        stagger: 0.08,
      });

      // Inner SVGs de-blur and settle slightly after their frames (offset 0.05s).
      entranceTimeline.to(
        imageFrames.map(svgOf),
        { yPercent: 0, filter: 'blur(0px)', duration: 0.85, ease: 'power2.out', stagger: 0.08 },
        0.05
      );

      // ─── 3. Hover-gated float ─────────────────────────────────────────────
      // Track the active float tween per card so we can kill it on leave.
      const floatTweens = new Map<HTMLElement, gsap.core.Tween>();

      const onEnter = (card: HTMLElement) => () => {
        const frame = card.querySelector<HTMLElement>('[data-product-animation-target]');
        if (!frame) return;

        const target = svgOf(frame);

        // Kill any in-progress settle-back tween before starting the float.
        floatTweens.get(card)?.kill();

        floatTweens.set(
          card,
          gsap.to(target, {
            y: -9,
            duration: 2.6,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          })
        );
      };

      const onLeave = (card: HTMLElement) => () => {
        const frame = card.querySelector<HTMLElement>('[data-product-animation-target]');
        if (!frame) return;

        const target = svgOf(frame);

        // Kill the float loop and smoothly return to rest position.
        floatTweens.get(card)?.kill();
        floatTweens.delete(card);

        gsap.to(target, { y: 0, duration: 0.55, ease: 'power2.out' });
      };

      // Attach listeners and keep references for cleanup.
      type Listener = { card: HTMLElement; enter: () => void; leave: () => void };
      const listeners: Listener[] = cards.map((card) => {
        const enter = onEnter(card);
        const leave = onLeave(card);
        card.addEventListener('mouseenter', enter);
        card.addEventListener('mouseleave', leave);
        return { card, enter, leave };
      });

      // ─── 4. Refresh after full load (fixes Turbopack stale positions) ─────
      const refreshOnLoad = () => ScrollTrigger.refresh();
      if (document.readyState === 'complete') {
        refreshOnLoad();
      } else {
        window.addEventListener('load', refreshOnLoad, { once: true });
      }

      // ─── Cleanup ──────────────────────────────────────────────────────────
      return () => {
        window.removeEventListener('load', refreshOnLoad);

        for (const tween of floatTweens.values()) tween.kill();
        floatTweens.clear();

        listeners.forEach(({ card, enter, leave }) => {
          card.removeEventListener('mouseenter', enter);
          card.removeEventListener('mouseleave', leave);
        });

        entranceTimeline.scrollTrigger?.kill();
        entranceTimeline.kill();

        imageFrames.forEach((frame) => {
          gsap.set([frame, svgOf(frame)], { clearProps: 'all' });
        });
      };
    });

    return () => media.revert();
  });

  return null;
};
