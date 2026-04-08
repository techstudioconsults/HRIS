'use client';

import { CheckMailCard, ForgotPassword } from '@/modules/@org/auth';
import { useSearchParameters } from '@workspace/ui/hooks';

const Page = () => {
  const value = useSearchParameters('view');

  const getCurrentView = () => {
    if (value === 'mail') return <CheckMailCard />;
    return <ForgotPassword />;
  };

  return getCurrentView();
};

export default Page;
