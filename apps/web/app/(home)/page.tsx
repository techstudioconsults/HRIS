// import { BuiltForAllTeams, Hero, OrganizationOnboarding } from './_views';
'use client';

import { OurProducts } from './_views/our-products/_components/lazy-our-products-section';
import dynamic from 'next/dynamic';
import { OurProductsPlaceholder } from './_components/our-products-placeholder';
import { Hero } from './_views';

const BuiltForAllTeams = dynamic(
  () => import('./_views').then((module) => module.BuiltForAllTeams),
  {
    ssr: false,
    loading: () => <OurProductsPlaceholder />,
  }
);
const OrganizationOnboarding = dynamic(
  () => import('./_views').then((module) => module.OrganizationOnboarding),
  {
    ssr: false,
    loading: () => <OurProductsPlaceholder />,
  }
);

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
