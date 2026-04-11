import type { Metadata, Viewport } from 'next';

import './globals.css';

import { cn } from '@workspace/ui/lib/utils';
import React from 'react';
import { Providers } from '@/components/providers';
import { Playfair_Display, Work_Sans } from 'next/font/google';

export const metadata: Metadata = {
  title: 'HRIS',
  description: 'A New HR System by Techstudio Academy',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HRIS',
    startupImage: [
      '/icons/icon-512-v2.png',
      {
        url: '/icons/icon-512-v2.png',
        media:
          '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: '/icons/icon-512-v2.png',
        media:
          '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: '/icons/icon-512-v2.png',
        media:
          '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: '/icons/icon-512-v2.png',
        media:
          '(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: '/icons/icon-512-v2.png',
        media:
          '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192-v2.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512-v2.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: [{ url: '/icons/icon-192-v2.png', type: 'image/png' }],
    apple: [{ url: '/icons/apple-touch-icon-v2.png', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0f172a',
};

const fontSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-mono',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          fontSans.variable,
          fontMono.variable,
          `font-sans antialiased`
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
