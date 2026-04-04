'use client';

import { queryClient } from '@/lib/react-query/query-client';
import { QueryClientProvider } from '@tanstack/react-query';

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/*<ReactQueryDevtools initialIsOpen={false} />*/}
    </QueryClientProvider>
  );
}
