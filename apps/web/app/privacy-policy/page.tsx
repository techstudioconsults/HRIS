import { Hero, PolicyContent, CTA } from '../../components/common';
import { PRIVACY_POLICY_CONTENT } from '../../constants/privacy-policy';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Hero
        title={PRIVACY_POLICY_CONTENT.intro.title}
        lastUpdated={PRIVACY_POLICY_CONTENT.lastUpdated}
        searchPlaceholder="Search for policy, data.."
      />
      <PolicyContent
        intro={PRIVACY_POLICY_CONTENT.intro}
        sections={PRIVACY_POLICY_CONTENT.sections}
      />
      <CTA />
    </>
  );
}
