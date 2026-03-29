import Link from 'next/link';
import { Button } from '@workspace/ui/components/button';
import { Navbar } from '../components/common/navbar';
import { CTA } from '../components/common/cta';

export default function NotFound() {
  return (
    <>
      {/* Hero-style banner re-using the same bg image as the rest of the site */}
      <section className="relative min-h-[500px] pt-32 pb-20 px-6 md:px-12 bg-[url('/images/hero-bg.svg')] bg-cover bg-center overflow-hidden flex items-center">
        <Navbar />

        <div className="max-w-7xl mx-auto text-center relative z-10 flex flex-col items-center gap-6 w-full">
          {/* Large 404 badge */}
          <span className="inline-flex items-center justify-center rounded-full bg-[#0066F3]/10 text-[#0066F3] text-sm font-semibold px-5 py-2 tracking-widest uppercase">
            Error 404
          </span>

          <h1 className="text-5xl md:text-[80px] font-bold text-[#003B99] leading-none tracking-tight">
            Page Not Found
          </h1>

          <p className="text-gray-500 text-lg md:text-xl max-w-xl leading-relaxed">
            Oops! The page you&apos;re looking for doesn&apos;t exist or may
            have been moved. Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <Button
              className="bg-[#0066F3] hover:bg-[#0052CC] text-white px-8 h-[52px] text-base font-bold rounded-[10px] w-full sm:w-auto"
              asChild
            >
              <Link href="/">Back to Home</Link>
            </Button>

            <Button
              variant="outline"
              className="border-[#0066F3] text-[#0066F3] hover:bg-[#0066F3]/5 px-8 h-[52px] text-base font-bold rounded-[10px] w-full sm:w-auto"
              asChild
            >
              <Link href="/help-center">Visit Help Center</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick links section */}
      <section className="px-6 md:px-12 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-xl font-semibold text-[#232323] mb-10">
            You might be looking for
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_LINKS.map(({ label, description, href }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm
                           hover:border-[#0066F3]/30 hover:shadow-md transition-all duration-200"
              >
                <span className="font-semibold text-[#232323] group-hover:text-[#0066F3] transition-colors">
                  {label}
                </span>
                <span className="text-sm text-[#6A717D] leading-relaxed">
                  {description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}

const QUICK_LINKS = [
  {
    label: 'Privacy Policy',
    description: 'Learn how we handle and protect your data.',
    href: '/privacy-policy',
  },
  {
    label: 'Terms of Use',
    description: 'Read the terms that govern your use of our platform.',
    href: '/terms-of-use',
  },
  {
    label: 'Refund Policy',
    description: 'Understand our refund and cancellation rules.',
    href: '/refund-policy',
  },
  {
    label: 'Help Center',
    description: 'Browse guides and answers to common questions.',
    href: '/help-center',
  },
  {
    label: 'Contact Us',
    description: 'Get in touch with our support team directly.',
    href: '/contact',
  },
  {
    label: 'Start Free Trial',
    description: 'Create your account and explore the platform for free.',
    href: '/register',
  },
];
