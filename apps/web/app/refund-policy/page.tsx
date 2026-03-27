import { LandingLayout, Hero, PolicyContent, CTA } from '../../components/common';
import { REFUND_POLICY_CONTENT } from '../../constants/refund-policy';

export default function RefundPolicyPage() {
  return (
    <LandingLayout>
      <Hero
        title={REFUND_POLICY_CONTENT.intro.title}
        lastUpdated={REFUND_POLICY_CONTENT.lastUpdated}
        searchPlaceholder="Search for refund, billing.."
      />
      <PolicyContent intro={REFUND_POLICY_CONTENT.intro} sections={REFUND_POLICY_CONTENT.sections} />
      <CTA />
    </LandingLayout>
  );
}
