'use client';

import { useEffect, useState } from 'react';
import { isIOSDevice, isRunningAsPWA } from '@/lib/pwa/detect-pwa';
import {
  Drawer,
  DrawerContent,
  DrawerClose,
} from '@workspace/ui/components/drawer';
import { Button } from '@workspace/ui/components/button';
import { Icon } from '@workspace/ui/lib/icons/icon';

const DISMISS_STORAGE_KEY = 'pwa-ios-prompt-dismissed-at';
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function isBrowserEligible(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent;
  // Exclude in-app browsers (Facebook, Instagram, Twitter/X) that can't install PWAs
  const isInAppBrowser = /FBAN|FBAV|Instagram|Twitter/.test(userAgent);
  if (isInAppBrowser) return false;
  // Safari on iOS or Chrome on iOS (CriOS)
  const isIOSSafari =
    /Safari/.test(userAgent) && !/CriOS|FxiOS|OPiOS|mercury/.test(userAgent);
  const isIOSChrome = /CriOS/.test(userAgent);
  return isIOSSafari || isIOSChrome;
}

function isIOSChromeBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  return /CriOS/.test(navigator.userAgent);
}

function wasRecentlyDismissed(): boolean {
  try {
    const stored = localStorage.getItem(DISMISS_STORAGE_KEY);
    if (!stored) return false;
    return Date.now() - Number(stored) < DISMISS_TTL_MS;
  } catch {
    return false;
  }
}

function recordDismissal(): void {
  try {
    localStorage.setItem(DISMISS_STORAGE_KEY, String(Date.now()));
  } catch {
    // localStorage blocked (private browsing, etc.) — fail silently
  }
}

// iOS share button icon (box with arrow pointing up)
const ShareIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block align-middle"
    aria-hidden
  >
    <path d="M8 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

// "Add to Home Screen" icon (square with plus)
const AddToHomeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block align-middle"
    aria-hidden
  >
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export function IOSInstallPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const isChrome = isIOSChromeBrowser();

  useEffect(() => {
    if (!isIOSDevice() || isRunningAsPWA() || !isBrowserEligible()) return;
    if (wasRecentlyDismissed()) return;

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, []);

  const handleClose = () => {
    recordDismissal();
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DrawerContent className="px-6 pb-8 pt-4 max-w-lg mx-auto">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            {/* App icon */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/apple-touch-icon-v3.png"
              alt="HRIS app icon"
              width={52}
              height={52}
              className="rounded-[12px] shadow-md"
            />
            <div>
              <p className="font-semibold text-foreground leading-tight">
                HRIS
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Techstudio Academy
              </p>
            </div>
          </div>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full -mt-1 -mr-2"
              onClick={handleClose}
              aria-label="Dismiss install prompt"
            >
              <Icon name={`XCircle`} className="size-4" />
            </Button>
          </DrawerClose>
        </div>

        <h2 className="text-base font-semibold text-foreground mb-1">
          Add to Home Screen
        </h2>
        <p className="text-sm text-muted-foreground mb-5 leading-snug">
          Install HRIS for a faster, full-screen experience — no browser bar.
        </p>

        <ol className="space-y-4">
          <li className="flex items-start gap-3">
            <span className="shrink-0 flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
              1
            </span>
            <span className="text-sm text-foreground leading-snug">
              Tap the{' '}
              <span className="inline-flex items-center gap-1 font-medium">
                <ShareIcon />
                {isChrome ? 'Share' : 'Share'}
              </span>{' '}
              button
              {isChrome
                ? ' in the top-right corner of your browser'
                : ' in the Safari toolbar at the bottom of your screen'}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="shrink-0 flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
              2
            </span>
            <span className="text-sm text-foreground leading-snug">
              Scroll down and tap{' '}
              <span className="inline-flex items-center gap-1 font-medium">
                <AddToHomeIcon />
                Add to Home Screen
              </span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="shrink-0 flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
              3
            </span>
            <span className="text-sm text-foreground leading-snug">
              Tap <span className="font-medium">Add</span> in the top-right
              corner to confirm
            </span>
          </li>
        </ol>

        <Button className="w-full mt-6" variant="outline" onClick={handleClose}>
          Maybe later
        </Button>
      </DrawerContent>
    </Drawer>
  );
}
