import { BuiltForAllTeams, Hero, OrganizationOnboarding } from './_views';
import { LazyOurProducts } from './_components/lazy-our-products-section';

export default function Page() {
  return (
    <main className="relative">
      <Hero />
      <LazyOurProducts />
      <BuiltForAllTeams />
      <OrganizationOnboarding />
    </main>
  );
}
