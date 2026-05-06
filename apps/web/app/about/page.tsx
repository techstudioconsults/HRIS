import { Hero, CTA } from '../../components/common';

export default function AboutPage() {
  return (
    <>
      <Hero title="About Us" showSearch={false} />
      <section className="px-6 md:px-12 py-16 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            We&apos;re a team on a mission to make HR simpler for growing
            companies. Our full story is coming soon.
          </p>
        </div>
      </section>
      <CTA />
    </>
  );
}
