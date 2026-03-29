import {
  BuiltForAllTeams,
  FAQs,
  Hero,
  OrganizationOnboarding,
  OurProducts,
  Testimonial,
} from './_views';
import { CTA } from '../../components/common';

export default function Page() {
  return (
    <main className="relative">
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
