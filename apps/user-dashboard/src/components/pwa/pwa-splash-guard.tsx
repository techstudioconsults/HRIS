'use client';

import { useEffect } from 'react';

const SPLASH_DELAY_MS = 1000;

export function PwaSplashGuard() {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.documentElement.dataset.splash = 'ready';
    }, SPLASH_DELAY_MS);
    return () => clearTimeout(timer);
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
