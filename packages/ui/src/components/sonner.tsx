'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';
import { Check, Info, OctagonAlert, ShieldAlert } from 'lucide-react';

const Toaster = ({ ...properties }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="bottom-right"
      richColors
      icons={{
        error: <ShieldAlert size={24} />,
        success: <Check size={24} />,
        warning: <OctagonAlert size={24} />,
        info: <Info size={24} />,
      }}
      toastOptions={{
        classNames: {
          toast: '!gap-4 !shadow-5xl !min-w-md',
          title: '!font-bold',
          description: '!font-medium',
          actionButton: '',
          cancelButton: '',
          closeButton: '!absolute !-right-4 !-top-1 !relative-auto !ml-auto',
          error: '!text-destructive !bg-background',
          success: '!text-success !bg-success-50',
          warning: '!text-warning-600 !bg-warning-50',
          info: '!text-info !bg-primary-50 ',
        },
      }}
      {...properties}
    />
  );
};

export { Toaster };
