export const REFUND_POLICY_CONTENT = {
  lastUpdated: '04/03/2026',
  intro: {
    title: 'Refund Policy',
    description:
      'This Refund Policy outlines how refunds are handled for Techstudio HR subscriptions.',
  },
  sections: [
    {
      id: 1,
      title: 'Subscription Model',
      content:
        'Techstudio HR operates on a subscription-based billing model. Fees are charged in advance based on your selected plan.',
    },
    {
      id: 2,
      title: 'Free Trials',
      content: 'If a free trial is offered:',
      items: [
        'No charges apply during the trial period',
        'You may cancel anytime before billing starts',
      ],
    },
    {
      id: 3,
      title: 'Refund Eligibility',
      content: 'Refunds may be granted if:',
      items: [
        'Duplicate charges occur',
        'Billing errors are confirmed',
        'Service was unavailable for extended periods',
      ],
      note: 'Refunds are not guaranteed for: Change of mind, Partial usage of subscription, Failure to cancel before renewal.',
    },
    {
      id: 4,
      title: 'Cancellation Policy',
      content: 'You may cancel your subscription anytime via:',
      items: ['Account billing settings', 'Contacting support'],
      note: 'Cancellation prevents future billing but does not retroactively refund prior payments.',
    },
    {
      id: 5,
      title: 'Processing Time',
      content:
        'Approved refunds are processed within 5—10 business days depending on your payment provider.',
    },
    {
      id: 6,
      title: 'Contact for Refunds',
      items: ['Email: billing@techstudiohr.com'],
    },
  ],
};
