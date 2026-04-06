import { Playfair_Display, Work_Sans } from 'next/font/google';

import './globals.css';
import { ReactNode } from 'react';
import { Providers } from '../components/providers';
import { Footer, Navbar } from '../components/common';
import { cn } from '@workspace/ui/lib/utils';

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
        </Providers>
      </body>
    </html>
  );
}
