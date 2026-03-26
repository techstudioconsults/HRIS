import { Hero, OurProducts } from './_views';
import { HomeTransitions } from '../../lib/gsap/micro-interactions/home-transitions';

export default function Page() {
  return (
    <main className="relative">
      <HomeTransitions />
      <Hero />
      <OurProducts />
    </main>
  );
}
