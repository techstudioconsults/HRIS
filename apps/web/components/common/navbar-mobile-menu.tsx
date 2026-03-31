'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LucideChevronDown,
  LucideChevronRight,
  LucideMenu,
  LucideSparkles,
  LucideX,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@workspace/ui/components/drawer';
import { MainButton } from '@workspace/ui/lib/button';
import { cn } from '@workspace/ui/lib/utils';
import type { NavLinkItem } from './navbar-links';

interface NavbarMobileMenuProps {
  links: NavLinkItem[];
}

export const NavbarMobileMenu = ({ links }: NavbarMobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
      direction="right"
      shouldScaleBackground={false}
    >
      <DrawerTrigger asChild>
        <MainButton
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-navbar-menu"
          aria-haspopup="dialog"
          aria-label="Toggle navigation menu"
          variant="outline"
          isIconOnly
          size="icon"
          className="lg:hidden"
          icon={isOpen ? <LucideX size={18} /> : <LucideMenu size={18} />}
        />
      </DrawerTrigger>

      <DrawerContent
        id="mobile-navbar-menu"
        className={cn(
          'z-1001 flex h-svh max-h-svh overflow-hidden ' +
            'w-[86vw] max-w-sm border-slate-200 bg-white/98' +
            ' p-0 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.45)]',
          'data-[vaul-drawer-direction=right]:w-[86vw] ' +
            'data-[vaul-drawer-direction=right]:max-w-sm'
        )}
      >
        <DrawerHeader className="shrink-0 gap-3 border-b border-slate-100 px-5 pb-5 pt-6 text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E9F1FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0052CC]">
                <LucideSparkles size={12} />
                Menu
              </span>
              <div>
                <DrawerTitle className="text-xl text-slate-900">
                  TechStudioHR
                </DrawerTitle>
                <DrawerDescription className="mt-1 text-sm leading-6 text-slate-500">
                  is simply dummy text of the printing and typesetting industry.
                </DrawerDescription>
              </div>
            </div>

            <DrawerClose asChild>
              <MainButton
                type="button"
                variant="primary"
                isIconOnly
                size="icon"
                aria-label="Close navigation menu"
                icon={<LucideX size={18} />}
              />
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-5 pt-4">
          <div className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="group flex items-start gap-3 rounded-3xl border border-slate-200/80 bg-slate-50/80 px-4 py-4 transition-all hover:border-[#0066F3]/20 hover:bg-white hover:shadow-[0_16px_36px_-28px_rgba(0,102,243,0.45)]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-semibold text-slate-900">
                      {link.name}
                    </span>
                    {link.badge && (
                      <span className="rounded-full bg-[#E9F1FF] px-2.5 py-1 text-[11px] font-semibold text-[#0052CC]">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  {link.description && (
                    <p className="mt-1.5 text-sm leading-6 text-slate-500">
                      {link.description}
                    </p>
                  )}
                </div>

                <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200 transition-colors group-hover:text-[#0066F3]">
                  {link.hasDropdown ? (
                    <LucideChevronDown size={18} />
                  ) : (
                    <LucideChevronRight size={18} />
                  )}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-3xl bg-muted px-4 py-4">
            <p className="text-sm font-medium text-slate-700">
              Need a quick hand getting started?
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Chat with our team or jump right into your free trial.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <DrawerClose asChild>
                <MainButton
                  variant="primaryOutline"
                  size="xl"
                  href="/login"
                  className="w-full"
                >
                  Login
                </MainButton>
              </DrawerClose>
              <DrawerClose asChild>
                <MainButton
                  variant="primary"
                  size="xl"
                  href="/regsiter"
                  className="w-full"
                >
                  Start Free Trial
                </MainButton>
              </DrawerClose>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
