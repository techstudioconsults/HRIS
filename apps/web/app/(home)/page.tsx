import {
  BuiltForAllTeams,
  Hero,
  OrganizationOnboarding,
  OurProducts,
} from './_views';
import { Testimonial } from './_views/Testimonial';
import { FAQs } from './_views/frequently-asked-questions';
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
