import { Hero, CTA } from '../../components/common';
import { REFUND_POLICY_CONTENT } from '../../constants/refund-policy';
import { PolicyContent } from '../privacy-policy/PolicyContent';

export default function RefundPolicyPage() {
  return (
    <>
      <Hero
        title={REFUND_POLICY_CONTENT.intro.title}
        searchPlaceholder="Search for refund, billing.."
      />
      <PolicyContent
        intro={REFUND_POLICY_CONTENT.intro}
        sections={REFUND_POLICY_CONTENT.sections}
      />
      <CTA />
    </>
  );
}
