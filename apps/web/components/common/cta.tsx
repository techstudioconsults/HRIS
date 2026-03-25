import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import { cn } from '@workspace/ui/lib/utils';

export const CTA = () => {
  return (
    <section className="px-6 md:px-12 py-10 bg-white">
      <div
        className={cn(
          'max-w-[1240px] mx-auto rounded-[32px] py-10 lg:py-20 px-8 text-center relative overflow-hidden',
          "bg-[#003B99] bg-[url('/images/cta_background.svg')] bg-cover bg-center"
        )}
      >
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-[48px] font-bold text-white leading-tight">Run HR the Smart Way</h2>
          <p className="text-white/90 text-base md:text-[18px] leading-relaxed max-w-lg">
            Join forward-thinking teams using Techstudio HR to <br className="hidden md:block" /> simplify people
            operations.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 w-full sm:w-auto">
            <Button
              className="bg-[#0052CC] hover:bg-[#0042A3] text-white w-full sm:w-auto px-8 h-[56px] text-base font-bold rounded-[10px]"
              asChild
            >
              <Link href="/register">Start Free Trial</Link>
            </Button>
            <Button
              className="bg-white hover:bg-blue-50 text-[#0052CC] w-full sm:w-auto px-8 h-[56px] text-base font-bold rounded-[10px]"
              asChild
            >
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
