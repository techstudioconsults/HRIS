import {
  BuiltForAllTeams,
  FAQs,
  Hero,
  OrganizationOnboarding,
  OurProducts,
  Testimonial,
} from './_views';
import { CTA } from '../../components/common';
import { HeaderEntrance } from '../../components/micro-interactions/header-entrance';

export default function Page() {
  return (
    <main className="relative">
      <HeaderEntrance />
      <Hero />
      <OurProducts />
      <BuiltForAllTeams />
      <OrganizationOnboarding />
      <Testimonial />
      <FAQs />
      <CTA />
    </main>
  );
}
