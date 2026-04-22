import Link from 'next/link';
import { cn } from '@workspace/ui/lib/utils';
import { NavbarMobileMenu } from './navbar-mobile-menu';
import { NAV_LINKS } from './navbar-links';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { MainButton } from '@workspace/ui/lib/button';
import Logo from '~/images/home/logo.svg';

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
        <Link href={`/`} className="w-30">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-foreground hover:text-primary-400 font-medium
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
          <MainButton
            isExternal
            href="/login"
            variant={`default`}
            className="hover:text-primary font-semibold text-sm transition-colors"
          >
            Login
          </MainButton>
          <MainButton isExternal href="/register" variant={`primary`}>
            Start Free Trial
          </MainButton>
        </div>

        <NavbarMobileMenu links={NAV_LINKS} />
      </div>
    </nav>
  );
};
