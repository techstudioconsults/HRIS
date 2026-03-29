import { redirect } from 'next/navigation';

export default function HelpCenterPage() {
  // Redirect to the first article by default
  redirect('/help-center/getting-started/create-your-organization');
}
