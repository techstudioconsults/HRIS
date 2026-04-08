'use client';

import { Logo } from '@workspace/ui/lib/logo';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

const Page = () => {
  useEffect(() => {
    redirect('/dashboard');
  }, []);
  return (
    <section className={`flex h-dvh w-full items-center justify-center`}>
      <Logo />
    </section>
  );
};
export default Page;
