export interface NavLinkItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  description?: string;
  badge?: string;
}

export const NAV_LINKS: NavLinkItem[] = [
  {
    name: 'Products',
    href: '#',
    hasDropdown: true,
    description:
      'Discover the HR, payroll, and workflow tools built for growing teams.',
    badge: 'Popular',
  },
  {
    name: 'Pricing',
    href: '/pricing',
    description:
      'See simple plans that scale from early teams to larger organizations.',
  },
  {
    name: 'About Us',
    href: '/about',
    description:
      'Meet the team behind a friendlier HR platform for modern companies.',
  },
  {
    name: 'Contact',
    href: '/contact',
    description: 'Talk to us about your team, your goals, and how we can help.',
  },
];
