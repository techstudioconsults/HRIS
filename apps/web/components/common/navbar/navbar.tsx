import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import { cn } from '@workspace/ui/lib/utils';
import { Logo } from '@workspace/ui/lib/logo';
import { NavbarMobileMenu } from './navbar-mobile-menu';
import { NavbarScrollState } from './navbar-scroll-state';
import { NAV_LINKS } from './navbar-links';
import { Icon } from '@workspace/ui/lib/icons/icon';

export const Navbar = () => {
  return (
    <nav
      id="site-navbar-root"
      data-scrolled="false"
      className={cn(
        'w-full flex justify-center px-4 md:px-6 fixed top-0' +
          'left-0 z-999 transition-all duration-300',
        'py-8 data-[scrolled=true]:pt-2 data-[scrolled=true]:md:pt-4'
      )}
    >
      <NavbarScrollState />
      <div
        id="site-navbar-panel"
        data-scrolled="false"
        className={cn(
          'bg-background backdrop-blur-md rounded-[17px] px-4 md:px-8 py-3 flex' +
            ' items-center justify-between w-full max-w-[1200px] transition-all' +
            ' duration-300 border border-black/3',
          'shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] data-[scrolled=true]:shadow-xl'
        )}
      >
        <Link href={`/`} className="flex items-center gap-1">
          <Logo logo="/images/logo.png" width={25} height={25} />
          <span className="font-extrabold text-lg transition-colors ">
            TechStudioHR
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[#1E293B] hover:text-[#0052CC] font-medium
                 text-sm transition-colors flex items-center gap-1"
            >
              {link.name}
              {link.hasDropdown && (
                <Icon
                  name={`ChevronsUpDown`}
                  size={14}
                  className="text-gray-400"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <Link
            href="/login"
            className="text-[#1E293B] hover:text-[#0052CC] font-semibold text-sm transition-colors"
          >
            Login
          </Link>
          <Button
            className="rounded-md bg-[#0066F3] hover:bg-[#0052CC] text-white px-6 h-11 font-bold"
            asChild
          >
            <Link href="/register">Start Free Trial</Link>
          </Button>
        </div>

        <NavbarMobileMenu links={NAV_LINKS} />
      </div>
    </nav>
  );
};
