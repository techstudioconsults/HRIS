import { Hero, CTA } from '../../components/common';

export default function PricingPage() {
  return (
    <>
      <Hero title="Pricing" showSearch={false} />
      <section className="px-6 md:px-12 py-16 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            We&apos;re putting the finishing touches on our pricing page. Check
            back soon for transparent, team-friendly plans.
          </p>
        </div>
      </section>
      <CTA />
    </>
  );
}
