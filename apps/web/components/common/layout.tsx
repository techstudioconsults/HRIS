import { Footer } from './footer';

interface LandingLayoutProperties {
  children: React.ReactNode;
}

export const LandingLayout = ({ children }: LandingLayoutProperties) => {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};
