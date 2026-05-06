import { Hero, CTA } from '../../components/common';

export default function ContactPage() {
  return (
    <>
      <Hero title="Contact Us" showSearch={false} />
      <section className="px-6 md:px-12 py-16 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            We&apos;d love to hear from you. Reach out at{' '}
            <a
              href="mailto:hello@techstudiohq.com"
              className="text-primary underline underline-offset-2"
            >
              hello@techstudiohq.com
            </a>{' '}
            and our team will get back to you shortly.
          </p>
        </div>
      </section>
      <CTA />
    </>
  );
}
