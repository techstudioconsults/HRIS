'use client';

import { Logo } from '@workspace/ui/lib';
import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import { LucideChevronDown, LucideMenu, LucideX } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@workspace/ui/lib/utils';
export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Products', href: '#', hasDropdown: true },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav
        className={cn(
          'w-full flex justify-center px-4 md:px-6 fixed top-0 left-0 right-0 z-100 transition-all duration-300',
          scrolled ? 'pt-2 md:pt-4' : 'pt-4 md:pt-8'
        )}
      >
        <div
          className={cn(
            'bg-white/95 backdrop-blur-md rounded-[17px] px-4 md:px-8 py-3 flex items-center justify-between w-full max-w-[1200px] transition-all duration-300 border border-black/3',
            scrolled ? 'shadow-xl' : 'shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)]'
          )}
        >
          <div className="flex items-center gap-1">
            <Logo logo="/images/logo.png" width={25} height={25} />
            <span className="font-extrabold text-lg transition-colors text-black">TechStudioHR</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[#1E293B] hover:text-[#0052CC] font-medium text-sm transition-colors flex items-center gap-1"
              >
                {link.name}
                {link.hasDropdown && <LucideChevronDown size={14} className="text-gray-400" />}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="/login" className="text-[#1E293B] hover:text-[#0052CC] font-semibold text-sm transition-colors">
              Login
            </Link>
            <Button className="rounded-md bg-[#0066F3] hover:bg-[#0052CC] text-white px-6 h-11 font-bold" asChild>
              <Link href="/register">Start Free Trial</Link>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2 text-gray-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <LucideX size={24} /> : <LucideMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-90 bg-white transition-transform duration-300 lg:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col pt-32 px-8 gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-xl font-bold text-[#1E293B] flex items-center justify-between"
            >
              {link.name}
              {link.hasDropdown && <LucideChevronDown size={20} />}
            </Link>
          ))}
          <div className="h-px bg-gray-100 my-4" />
          <Link href="/login" onClick={() => setIsOpen(false)} className="text-xl font-bold text-[#1E293B]">
            Login
          </Link>
          <Button className="rounded-xl bg-[#0066F3] hover:bg-[#0052CC] text-white h-14 text-lg font-bold" asChild>
            <Link href="/register" onClick={() => setIsOpen(false)}>
              Start Free Trial
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};
