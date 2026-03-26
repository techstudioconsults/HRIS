import Link from 'next/link';

import { Button } from '@workspace/ui/components/button';

export const HeroActions = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
      <Button
        asChild
        size="xl"
        variant="primary"
        className="h-auto rounded-[9px] px-6 py-3.5 text-base font-semibold lg:text-[18px]"
      >
        <Link href="/apps/web/public">Start Free Trial</Link>
      </Button>
      <Button
        asChild
        size="xl"
        variant="primaryOutline"
        className="h-auto rounded-[9px] border-[#0266F3] px-6 py-3.5 text-base font-semibold
         text-[#0266F3] shadow-none lg:text-[18px]"
      >
        <Link href="/apps/web/public">Login</Link>
      </Button>
    </div>
  );
};
