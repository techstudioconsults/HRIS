import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@workspace/ui/components/button';

export default function Page() {
  return (
    <main className="relative overflow-x-clip bg-white">
      <section className="relative mx-auto max-w-[1440px] px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-10 lg:pb-24 lg:pt-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_50%_19%,rgba(179,210,255,1)_6%,rgba(217,217,217,0)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-45 bg-[radial-gradient(#0266F3_1px,transparent_1px)] bg-size-[18px_18px]" />

        <div className="relative z-10 mx-auto flex max-w-[915px] flex-col items-center gap-8 text-center lg:gap-9">
          <div className="inline-flex items-center gap-1 rounded-2xl bg-white px-2 py-1 text-sm text-zinc-500 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_3px_3px_0px_rgba(0,0,0,0.04),0px_7px_4px_0px_rgba(0,0,0,0.03)]">
            <span className="rounded-xl bg-[#0266F3] px-2 py-1 text-sm font-bold text-white">New</span>
            <span className="pr-1">Now available across Africa</span>
          </div>

          <div className="space-y-6">
            <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-[-0.02em] text-zinc-800 sm:text-5xl lg:text-[62px] lg:leading-[1.2]">
              HR &amp; Payroll software built for modern African teams
            </h1>
            <p className="mx-auto max-w-[507px] text-balance text-base tracking-[-0.02em] text-zinc-500 sm:text-lg lg:text-[20px] lg:leading-[1.4]">
              Manage employees, run payroll, and automate HR operations all in one powerful platform.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <Button
              asChild
              size="xl"
              variant="primary"
              className="h-auto rounded-[9px] px-6 py-3.5 text-base font-semibold lg:text-[18px]"
            >
              <Link href="/">Start Free Trial</Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="primaryOutline"
              className="h-auto rounded-[9px] border-[#0266F3] px-6 py-3.5 text-base font-semibold text-[#0266F3] shadow-none lg:text-[18px]"
            >
              <Link href="/">Login</Link>
            </Button>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-14 max-w-[963px] overflow-hidden rounded-lg border-4 border-white shadow-[0_-6px_13px_0px_rgba(148,193,255,0.1),0_-24px_24px_0px_rgba(148,193,255,0.09),0_-54px_32px_0px_rgba(148,193,255,0.05)]">
          <Image
            src="/images/home/hero-dashboard.png"
            alt="Techstudio HR dashboard preview"
            width={963}
            height={565}
            className="h-auto w-full"
            priority
          />
        </div>
      </section>
    </main>
  );
}
