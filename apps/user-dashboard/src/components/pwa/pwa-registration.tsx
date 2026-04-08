'use client';

import { queryClient } from '@/lib/react-query/query-client';
import { useEffect } from 'react';

const SW_PATH = '/sw.js';

export function PwaRegistration() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' ||
      !('serviceWorker' in navigator)
    ) {
      return;
    }

    let isMounted = true;

    const handleMessage = (event: MessageEvent<{ type?: string }>) => {
      if (event.data?.type === 'SW_ACTIVATED') {
        void queryClient.invalidateQueries();
      }
    };

    const handleOnline = () => {
      void queryClient.invalidateQueries();
    };

    const registerWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register(SW_PATH, {
          scope: '/',
        });

        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) {
            return;
          }

          installing.addEventListener('statechange', () => {
            if (
              isMounted &&
              installing.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              installing.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      } catch {
        // Registration is best effort; the app should still work without SW.
      }
    };

    void registerWorker();

    navigator.serviceWorker.addEventListener('message', handleMessage);
    window.addEventListener('online', handleOnline);

    return () => {
      isMounted = false;
      navigator.serviceWorker.removeEventListener('message', handleMessage);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return null;
}
