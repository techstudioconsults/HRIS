import {
  BuiltForAllTeams,
  Hero,
  OrganizationOnboarding,
  OurProducts,
} from './_views';

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
