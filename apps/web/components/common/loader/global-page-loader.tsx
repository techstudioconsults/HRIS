'use client';

import { useEffect, useState } from 'react';
import { cn } from '@workspace/ui/lib/utils';
import { Sticker } from './sticker';

const LOADER_EXIT_MS = 280;

export const GlobalPageLoader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let domReadyHandler: (() => void) | null = null;
    let loadHandler: (() => void) | null = null;
    let rafIdOne: number | null = null;
    let rafIdTwo: number | null = null;
    let exitTimeoutId: number | null = null;

    const clearLoadHandler = () => {
      if (loadHandler) {
        window.removeEventListener('load', loadHandler);
        loadHandler = null;
      }
    };

    const hideLoader = () => {
      rafIdOne = requestAnimationFrame(() => {
        rafIdTwo = requestAnimationFrame(() => {
          setIsExiting(true);
          exitTimeoutId = window.setTimeout(() => {
            setIsVisible(false);
          }, LOADER_EXIT_MS);
        });
      });
    };

    const onReady = () => {
      clearLoadHandler();
      hideLoader();
    };

    if (document.readyState === 'complete') {
      onReady();
    } else {
      loadHandler = () => {
        onReady();
      };
      window.addEventListener('load', loadHandler, { once: true });

      if (document.readyState === 'loading') {
        domReadyHandler = () => {
          if (document.readyState === 'complete') {
            onReady();
          }
        };
        document.addEventListener('DOMContentLoaded', domReadyHandler, {
          once: true,
        });
      }
    }

    return () => {
      if (domReadyHandler) {
        document.removeEventListener('DOMContentLoaded', domReadyHandler);
      }
      clearLoadHandler();

      if (rafIdOne !== null) {
        cancelAnimationFrame(rafIdOne);
      }
      if (rafIdTwo !== null) {
        cancelAnimationFrame(rafIdTwo);
      }
      if (exitTimeoutId !== null) {
        window.clearTimeout(exitTimeoutId);
      }
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'global-page-loader',
        isExiting && 'opacity-0 visibility-hidden'
      )}
      role="status"
      aria-label="Loading page"
    >
      <Sticker />
    </div>
  );
};
