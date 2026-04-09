/**
 * PWA Detection Utility
 *
 * Detects if the app is running as an installed PWA (standalone mode)
 * vs running in a browser tab.
 *
 * Uses:
 * - CSS Media Query (modern standard): @media (display-mode: standalone)
 * - navigator.standalone (iOS Safari fallback)
 */

/**
 * Detects if the app is running as an installed PWA
 * @returns true if running in standalone/PWA mode, false if in browser
 */
export function isRunningAsPWA(): boolean {
  // Guard against SSR
  if (typeof window === 'undefined') {
    return false;
  }

  // Modern standard: display-mode media query
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  // iOS Safari fallback
  const isIOSStandalone =
    (window.navigator as unknown as Record<string, unknown>).standalone ===
    true;

  return isStandalone || isIOSStandalone;
}

/**
 * Gets the current display mode
 * @returns 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser'
 */
export function getDisplayMode():
  | 'standalone'
  | 'fullscreen'
  | 'minimal-ui'
  | 'browser' {
  if (typeof window === 'undefined') {
    return 'browser';
  }

  const modes = ['standalone', 'fullscreen', 'minimal-ui', 'browser'] as const;

  for (const mode of modes) {
    if (window.matchMedia(`(display-mode: ${mode})`).matches) {
      return mode;
    }
  }

  return 'browser';
}

/**
 * Checks if running on iOS
 */
export function isIOSDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Checks if running on iOS PWA
 */
export function isIOSPWA(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return isIOSDevice() && isRunningAsPWA();
}
