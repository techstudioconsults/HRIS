import type { Metadata, Viewport } from 'next';

import './globals.css';

import { cn } from '@workspace/ui/lib/utils';
import React from 'react';
import { Providers } from '@/components/providers';
import { Playfair_Display, Work_Sans } from 'next/font/google';

export const metadata: Metadata = {
  title: 'HRIS',
  description: 'A New HR System by Techstudio Academy',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 0.8,
  viewportFit: 'cover',
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
