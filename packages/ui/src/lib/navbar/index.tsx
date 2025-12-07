"use client";

import { ModeToggle } from "@/components/core/layout/ThemeToggle/theme-toggle";
import { NAV_LINKS } from "@/lib/tools/constants";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import MainButton from "../button";
import { NavItems } from "./nav-menu-item";

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={cn(`fixed top-0 z-10 w-full pr-4 backdrop-blur-sm`)}
      role="navbar"
    >
      <section className="flex w-full items-center justify-between">
        <div className={`flex items-center`}>
          <MainButton variant={`accent`} className={`min-w-[256px] text-black`}>
            Kingsley Solomon
          </MainButton>
          <NavItems className={`hidden lg:block`} links={NAV_LINKS} />
        </div>
        <div className={`hidden items-center lg:flex`}>
          <MainButton variant={`ghost`} className={``}>
            Contact Me
          </MainButton>
          <ModeToggle />
        </div>
        <MainButton
          variant="ghost"
          size="icon"
          className="lg:hidden"
          isIconOnly
          icon={
            isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )
          }
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        />
      </section>
      {isMobileMenuOpen && (
        <div
          className={cn(
            "fixed inset-x-0 z-40 w-full bg-white shadow-none lg:hidden",
          )}
        >
          <div>
            <NavItems className={``} links={NAV_LINKS} isMobile />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
