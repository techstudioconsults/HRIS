import { CTA } from './cta';
import { Footer } from './footer';

interface LandingLayoutProperties {
  children: React.ReactNode;
  showCTA?: boolean;
}

export const LandingLayout = ({ children, showCTA = true }: LandingLayoutProperties) => {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <main className="flex-grow">{children}</main>
      {showCTA && <CTA />}
      <Footer />
    </div>
  );
};
