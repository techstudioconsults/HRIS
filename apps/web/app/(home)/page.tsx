import {
  BuiltForAllTeams,
  Hero,
  OrganizationOnboarding,
  OurProducts,
} from './_views';
import Testimonial from './_views/Testimonial';

export default function Page() {
  return (
    <main className="relative">
      <Hero />
      <OurProducts />
      <BuiltForAllTeams />
      <OrganizationOnboarding />
      <Testimonial />
    </main>
  );
}
