import type { Metadata, Viewport } from 'next';

import './globals.css';

import { cn } from '@workspace/ui/lib/utils';
import React from 'react';
import { Providers } from '@/components/providers';
import { Playfair_Display, Work_Sans } from 'next/font/google';

export const metadata: Metadata = {
  title: 'HRIS',
  description: 'A New HR System by Techstudio Academy',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HRIS',
  },
  icons: {
    icon: [
      { url: '/images/logo-mini.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    shortcut: [{ url: '/images/logo-mini.svg', type: 'image/svg+xml' }],
    apple: [
      { url: '/images/logo-mini.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 0.8,
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
