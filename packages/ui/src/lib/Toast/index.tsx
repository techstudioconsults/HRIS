'use client';

import { Toaster } from '@workspace/ui/components/sonner';

export const Toast = () => {
  return (
    <Toaster
      closeButton
      position="bottom-right"
      expand={false}
      duration={5000}
    />
  );
};
