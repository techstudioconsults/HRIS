"use client";

// import { AuthCarousel } from "@/modules/@org/auth";
import { Logo } from "@workspace/ui/lib";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname } from "next/navigation";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const hideCarouselRoutes = ["forgot-password", "reset-password", "otp-verify"];
  const shouldHideCarousel = hideCarouselRoutes.some((route) => pathname.includes(route));

  return (
    <main className="min-h-screen">
      <section className={cn("grid min-h-[100dvh] grid-cols-1", !shouldHideCarousel && "md:grid-cols-2")}>
        {/* Content Section (Left on desktop, top on mobile) */}
        <section
          style={
            // shouldHideCarousel
            // ?
            {
              background: "url(/images/auth/bg-img.svg) no-repeat",
              backgroundSize: "cover",
            }
            // : {}
          }
          className="hide-scrollbar max-h-[100dvh] overflow-y-auto px-4 py-12"
        >
          <div className={cn("mx-auto mb-16 flex", !shouldHideCarousel && "max-w-[527px]")}>
            <Logo width={214} />
          </div>
          {children}
        </section>
        {/* Carousel Section (Right on desktop, hidden on mobile and specific routes) */}
        {!shouldHideCarousel && <div className="hidden max-h-[100dvh] md:block">{/* <AuthCarousel /> */}</div>}
      </section>
    </main>
  );
};

export default AuthLayout;
