'use client';

import { useEffect, useState } from 'react';

async function enableMocking(): Promise<void> {
  if (process.env.NODE_ENV !== 'development') return;
  if (process.env.NEXT_PUBLIC_USE_PAYROLL_MOCKS === 'false') return;
  const { worker } = await import('@/lib/msw/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

export function MswProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(
    process.env.NODE_ENV !== 'development' ||
      process.env.NEXT_PUBLIC_USE_PAYROLL_MOCKS === 'false'
  );

  useEffect(() => {
    enableMocking().then(() => setIsReady(true));
  }, []);

  if (!isReady) return null;
  return <>{children}</>;
}
