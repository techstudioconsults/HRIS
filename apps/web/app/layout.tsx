import { Playfair_Display, Work_Sans } from 'next/font/google';

import './globals.css';
import { ReactNode } from 'react';
import { Providers } from '../components/providers';
import { Footer, GlobalPageLoader, Navbar } from '../components/common';
import { SmoothScrollInit } from '../components/micro-interactions/smooth-scroll-init';

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
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <GlobalPageLoader />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <Providers>
              <SmoothScrollInit />
              <Navbar />
              {children}
              <Footer />
            </Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
