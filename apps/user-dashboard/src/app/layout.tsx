// import type { Metadata } from 'next';
//
// import './globals.css';
//
// import { cn } from '@workspace/ui/lib/utils';
// import React from 'react';
// import { Providers } from '@/components/providers';
// import { Playfair_Display, Work_Sans } from 'next/font/google';
//
// export const metadata: Metadata = {
//   title: 'HRIS',
//   description: 'A New HR System by Techstudio Academy',
// };
//
// const fontSans = Work_Sans({
//   subsets: ['latin'],
//   variable: '--font-sans',
// });
//
// const fontMono = Playfair_Display({
//   subsets: ['latin'],
//   variable: '--font-mono',
// });
//
// export default async function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={cn(
//           fontSans.variable,
//           fontMono.variable,
//           `font-sans antialiased`
//         )}
//       >
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   );
// }
import type { Metadata, Viewport } from 'next';

import './globals.css';
import '@workspace/ui/themes.css';

import { cn } from '@workspace/ui/lib/utils';
import React from 'react';
import { Providers } from '@/components/providers';
import { Playfair_Display, Work_Sans } from 'next/font/google';

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b',
};

export const metadata: Metadata = {
  title: 'HRIS',
  description: 'A New HR System by Techstudio Academy',
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
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
