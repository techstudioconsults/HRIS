import {
  LandingLayout,
  Hero,
  PolicyContent,
  CTA,
} from '../../components/common';
import { TERMS_OF_USE_CONTENT } from '../../constants/terms-of-use';

export default function TermsOfUsePage() {
  return (
    <LandingLayout>
      <Hero
        title={TERMS_OF_USE_CONTENT.intro.title}
        lastUpdated={TERMS_OF_USE_CONTENT.lastUpdated}
        searchPlaceholder="Search for terms, service.."
      />
      <PolicyContent
        intro={TERMS_OF_USE_CONTENT.intro}
        sections={TERMS_OF_USE_CONTENT.sections}
      />
      <CTA />
    </LandingLayout>
  );
}
