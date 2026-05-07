'use client';

import { useEffect } from 'react';

export function PwaSplashGuard() {
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      document.documentElement.dataset.splash = 'ready';
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="pwa-splash-guard" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo.png"
        alt=""
        className="pwa-splash-guard__logo"
        width={100}
        height={100}
      />
    </div>
  );
}
