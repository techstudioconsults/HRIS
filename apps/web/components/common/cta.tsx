import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import { cn } from '@workspace/ui/lib/utils';

interface CTAProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  showSecondaryButton?: boolean;
}

export const CTA = ({
  title = 'Run HR the Smart Way',
  description = 'Join forward-thinking teams using Techstudio HR to simplify people operations.',
  primaryButtonText = 'Start Free Trial',
  primaryButtonHref = '/register',
  secondaryButtonText = 'Contact Support',
  secondaryButtonHref = '/contact',
  showSecondaryButton = true,
}: CTAProps) => {
  return (
    <section className="px-6 md:px-12 py-10 bg-white">
      <div
        className={cn(
          'max-w-[1240px] mx-auto rounded-[32px] py-10 lg:py-20 px-8 text-center relative overflow-hidden',
          "bg-[#003B99] bg-[url('/images/cta_background.svg')] bg-cover bg-center"
        )}
      >
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-[48px] font-bold text-white leading-tight">
            {title}
          </h2>
          <p className="text-white/90 text-base md:text-[18px] leading-relaxed max-w-lg">
            {description.includes('<br') ? (
              <span dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              description
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 w-full sm:w-auto">
            <Button
              className="bg-primary hover:bg-primary/80 text-white w-full sm:w-auto px-8 h-[56px] text-base font-bold rounded-[10px]"
              asChild
            >
              <Link href={primaryButtonHref}>{primaryButtonText}</Link>
            </Button>
            {showSecondaryButton && (
              <Button
                className="bg-white hover:bg-white/80 text-primary w-full sm:w-auto px-8 h-[56px] text-base font-bold rounded-[10px]"
                asChild
              >
                <Link href={secondaryButtonHref}>{secondaryButtonText}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
