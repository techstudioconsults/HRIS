'use client';

import { Logo } from '@workspace/ui/lib/logo';
import { cn } from '@workspace/ui/lib/utils';
import { usePathname } from 'next/navigation';
import { AuthCarousel } from '@/modules/@org/auth';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';
  const hideCarouselRoutes = [
    'forgot-password',
    'reset-password',
    'otp-verify',
  ];
  const shouldHideCarousel = hideCarouselRoutes.some((route) =>
    pathname.includes(route)
  );

  return (
    <main className="min-h-screen">
      <section
        className={cn(
          'grid min-h-dvh grid-cols-1',
          !shouldHideCarousel && 'lg:grid-cols-12'
        )}
      >
        <section className="hide-scrollbar lg:col-span-7 max-h-dvh overflow-y-auto px-6">
          <div
            className={cn('mx-auto max-w-131.75 flex items-center min-h-40')}
          >
            <Logo
              logo={isDark ? `/images/logo-white.svg` : `/images/logo.svg`}
              width={214}
            />
          </div>
          {/*<hr className={`absolute left-0 right-0 top-40`}/>*/}
          <div className="flex min-h-[calc(100dvh-160px)] w-full items-center pb-10">
            {children}
          </div>
        </section>
        {/* Carousel Section (Right on desktop, hidden on mobile and specific routes) */}
        {!shouldHideCarousel && (
          <div className="hidden relative lg:flex lg:col-span-5 items-end">
            <Image
              src={cn(
                pathname.includes(`/login`)
                  ? `https://res.cloudinary.com/kingsleysolomon/image/upload/q_auto/f_auto/v1775329718/techstudio/hris-repo/t7vh85tq67fb7x6m6uhu.png`
                  : `https://res.cloudinary.com/kingsleysolomon/image/upload/q_auto/f_auto/v1775329814/techstudio/hris-repo/xd6dkhstewf5lkfbmfsr.png`
              )}
              alt={`name`}
              fill
              className={cn('object-cover')}
              quality={500}
              priority={true}
            />
            <AuthCarousel />
          </div>
        )}
      </section>
    </main>
  );
};

export default AuthLayout;
