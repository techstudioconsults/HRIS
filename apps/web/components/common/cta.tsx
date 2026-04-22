import { cn } from '@workspace/ui/lib/utils';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import { MainButton } from '@workspace/ui/lib/button';

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
      <Wrapper
        className={cn(
          'rounded-4xl py-10 lg:py-20 px-8 my-0! text-center relative overflow-hidden',
          "bg-primary bg-[url('/images/cta_background.svg')] bg-cover bg-center"
        )}
      >
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
          <h2 className="text-2xl text-balance md:text-[48px] font-bold text-white leading-tight">
            {title}
          </h2>
          <p className="text-white/90 text-base md:text-[18px] leading-relaxed max-w-lg">
            {description.includes('<br') ? (
              <span dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              description
            )}
          </p>

          <div className="flex flex-col sm:flex-row lg:items-center gap-4 mt-6 w-full sm:w-auto">
            <MainButton
              isExternal
              variant={`primary`}
              size={`2xl`}
              href={primaryButtonHref}
              className={`font-bold w-full`}
            >
              {primaryButtonText}
            </MainButton>
            {showSecondaryButton && (
              <MainButton
                className={`font-bold w-full`}
                size={`2xl`}
                href={secondaryButtonHref}
              >
                {secondaryButtonText}
              </MainButton>
            )}
          </div>
        </div>
      </Wrapper>
    </section>
  );
};
