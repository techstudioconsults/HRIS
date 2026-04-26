export interface PWAContextType {
  isPWA: boolean;
  displayMode: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  isIOSDevice: boolean;
  isIOSPWA: boolean;
  isInitialized: boolean;
}
