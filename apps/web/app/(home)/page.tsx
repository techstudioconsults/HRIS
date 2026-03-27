import { BuiltForAllTeams, Hero, OurProducts } from './_views';
import { OrganizationOnboarding } from './_views/organization-onboarding';

export default function Page() {
  return (
    <main className="relative">
      <Hero />
      <OurProducts />
      <BuiltForAllTeams />
      <OrganizationOnboarding />
    </main>
  );
}
