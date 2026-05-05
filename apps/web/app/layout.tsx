import type { Metadata } from 'next';
import { Playfair_Display, Work_Sans } from 'next/font/google';

import './globals.css';
import { ReactNode } from 'react';
import { Providers } from '../components/providers';
import { Footer, Navbar } from '../components/common';
import { ScrollToTopButton } from '../components/help';
import { cn } from '@workspace/ui/lib/utils';

export const metadata: Metadata = {
  title: 'HRIS — Techstudio Academy',
  description: 'A New HR System by Techstudio Academy',
  icons: {
    icon: [
      { url: '/icons/icon-192-v2.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512-v2.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: [{ url: '/icons/icon-192-v2.png', type: 'image/png' }],
    apple: [{ url: '/icons/apple-touch-icon-v3.png', type: 'image/png' }],
  },
};

const fontSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          fontSans.variable,
          fontMono.variable,
          `font-sans antialiased`
        )}
      >
        <Providers>
          <Navbar />
          <div id="smooth-wrapper">
            <div id="smooth-content">
              {children}
              <Footer />
            </div>
          </div>
          <ScrollToTopButton />
        </Providers>
      </body>
    </html>
  );
}
