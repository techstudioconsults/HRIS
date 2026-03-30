import { Logo } from '@workspace/ui/lib';
import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import Image from 'next/image';

export const Footer = () => {
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Payroll', href: '#' },
        { name: 'Attendance', href: '#' },
        { name: 'Leave management', href: '#' },
        { name: 'Resources', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Help Center', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms & Conditions', href: '/terms-of-use' },
        { name: 'Privacy policy', href: '/privacy-policy' },
        { name: 'Refund Policy', href: '/refund-policy' },
        { name: 'Compliance', href: '/compliance' },
      ],
    },
  ];

  return (
    <footer className="bg-[#E6F0FE] pt-24 pb-0 px-6 md:px-12  relative overflow-hidden text-center md:text-left">
      <div className="max-w-7xl mx-auto flex flex-col items-center md:items-start lg:grid lg:grid-cols-10 gap-16 lg:gap-8 border-b border-white/10 pb-16 mb-12 relative z-10">
        {/* Logo & Info */}
        <div className="lg:col-span-4 flex flex-col items-center md:items-start gap-8 w-full">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-1">
              <Logo logo="/images/logo.png" width={30} height={30} />
              <span className="font-extrabold text-xl transition-colors text-black">
                TechStudioHR
              </span>
            </div>
            <p className="text-black/70 text-base md:text-lg max-w-sm">
              1, Ogunlesi Street, Awoyokun Bus Stop, Onipanu Lagos
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-md">
            <h4 className="font-semibold text-black text-[18px]">
              Subscribe for Our Newsletter
            </h4>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <input
                id="newsletter-email"
                name="newsletterEmail"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="Email address"
                className="bg-white border-none rounded-[6px] h-[52px] px-5 text-black w-full"
              />
              <Button className="rounded-[6px] bg-[#0066F3] hover:bg-blue-600 text-white px-8 h-[52px] font-bold w-full sm:w-auto shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Link Columns */}
        <div className="lg:col-span-6 w-full grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
          {footerLinks.map((column) => (
            <div
              key={column.title}
              className="flex flex-col items-center md:items-start"
            >
              <p className="text-black font-bold mb-6 text-xl">
                {column.title}
              </p>
              <ul className="flex flex-col gap-4">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-black/70 hover:text-[#0066F3] text-lg transition-colors inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <hr className="border-black/10 mb-4" />

      <div className="max-w-7xl mx-auto pb-2 flex flex-col md:flex-row items-center justify-center relative z-10">
        <p className="text-black/50 text-[14px]">
          © {new Date().getFullYear()} Techstudio HR — All rights reserved.
        </p>
      </div>

      <div className="w-full flex justify-center pointer-events-none select-none overflow-hidden h-[100px] md:h-[150px] items-end">
        <Image
          src="/images/TechStudioHR-footer.svg"
          alt="hr "
          width={1200}
          height={150}
          className="w-full max-w-[1200px] object-contain object-bottom translate-y-4"
        />
      </div>
    </footer>
  );
};
