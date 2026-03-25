import { Logo } from '@workspace/ui/lib';
import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';

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
    <footer className="bg-[#E6F0FE] pt-24 pb-0 px-6 md:px-12 mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-16 lg:gap-8 border-b border-blue-100/50 pb-16 mb-12 relative z-10">
        {/* Logo & Info */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="flex items-center gap-1">
            <Logo logo="/images/logo.png" width={25} height={25} />
            <span className="font-extrabold text-lg transition-colors text-black">TechStudioHR</span>
          </div>
          <p className="text-[#5D636D] text-lg">All-in-one HR & Payroll software for modern African teams.</p>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-[#232323] text-[18px]">Subscribe for Our Newsletter</h4>
            <div className="flex gap-2 max-w-md">
              <input
                placeholder="Email address"
                className="bg-white border-gray-100 border focus-visible:ring-0 rounded-[6px] h-[52px] px-5 text-black"
              />
              <Button className="rounded-[6px] bg-primary hover:bg-primary/80 text-white px-8 h-[52px] font-bold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Link Columns */}
        {footerLinks.map((column) => (
          <div key={column.title} className="lg:col-span-2 w-full">
            <p className="text-[#6A717D] mb-8 text-xl">{column.title}</p>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#6A717D] hover:text-[#0052CC] text-lg transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <hr className="border-gray-100 mb-4" />

      <div className="max-w-7xl mx-auto pb-6 flex flex-col md:flex-row items-center justify-center relative z-10">
        <p className="text-[#64748B] text-[14px]">© {new Date().getFullYear()} Techstudio HR — All rights reserved.</p>
      </div>

      <div className="w-full flex justify-center pointer-events-none select-none overflow-hidden h-[100px] md:h-[150px] items-end">
        <img
          src="/images/TechStudioHR-footer.svg"
          alt="hr "
          className="w-full max-w-[1200px] object-contain object-bottom translate-y-4"
        />
      </div>
    </footer>
  );
};
