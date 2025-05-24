import { AuthCarousel } from "@/modules/@org/auth";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen">
      <section className="grid min-h-[100dvh] grid-cols-1 md:grid-cols-2">
        {/* Content Section (Left on desktop, top on mobile) */}
        <div className="max-h-[100dvh] overflow-y-auto px-4 py-12">{children}</div>
        {/* Carousel Section (Right on desktop, hidden on mobile) */}
        <div className="hidden max-h-[100dvh] md:block">
          <AuthCarousel />
        </div>
      </section>
    </main>
  );
};

export default AuthLayout;
