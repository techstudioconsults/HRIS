'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { SSEProvider } from '@/context/sse-provider';
import { SessionProvider } from '@/components/SessionProvider';
import NextTopLoader from 'nextjs-toploader';
import { ReactQueryProvider } from '@/lib/react-query/query-provider';
import { NuqsAdapter } from 'nuqs/adapters/next';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
import { Toast } from '@workspace/ui/lib/Toast';
import { KBarProviderWrapper } from '@/lib/kbar/kbar-provider';
import { Suspense } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <SessionProvider>
        <SSEProvider>
          <NextTopLoader showSpinner={false} />
          <ReactQueryProvider>
            <NuqsAdapter>
              <TooltipProvider>
                <Toast />
                {/* <NetworkStatusModal /> */}
                <KBarProviderWrapper>
                  <Suspense>{children}</Suspense>
                </KBarProviderWrapper>
              </TooltipProvider>
            </NuqsAdapter>
          </ReactQueryProvider>
        </SSEProvider>
      </SessionProvider>
    </NextThemesProvider>
  );
}
