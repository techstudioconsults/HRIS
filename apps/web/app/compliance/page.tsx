import { Hero, CTA } from '../../components/common';

export default function CompliancePage() {
  return (
    <>
      <Hero title="Compliance" showSearch={false} />
      <section className="px-6 md:px-12 py-16 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our compliance and security documentation is being updated. In the
            meantime, review our{' '}
            <a
              href="/privacy-policy"
              className="text-primary underline underline-offset-2"
            >
              Privacy Policy
            </a>{' '}
            and{' '}
            <a
              href="/terms-of-use"
              className="text-primary underline underline-offset-2"
            >
              Terms of Use
            </a>
            .
          </p>
        </div>
      </section>
      <CTA />
    </>
  );
}
