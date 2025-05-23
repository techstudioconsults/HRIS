import { AuthCarousel } from "@/modules/@org/auth";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={`max-w-screen overflow-x-hidden`}>
      <section className="grid min-h-[100dvh] grid-cols-1 justify-center md:-mx-4 md:grid-cols-[50%_50%] lg:mx-0">
        <section>{children}</section>
        <div className="relative order-1 overflow-hidden">
          <AuthCarousel />
        </div>
      </section>
    </main>
  );
};

export default AuthLayout;
