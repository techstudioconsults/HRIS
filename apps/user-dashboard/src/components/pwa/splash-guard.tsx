'use client';

import { useEffect } from 'react';

export function PwaSplashGuard() {
  useEffect(() => {
    document.documentElement.setAttribute('data-hydrated', 'true');
  }, []);

  return null;
}
