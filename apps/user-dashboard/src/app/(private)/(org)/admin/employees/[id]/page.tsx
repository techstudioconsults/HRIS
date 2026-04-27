import { EmployeeDetails } from '@/modules/@org/admin/employee';

import { type PageProps } from './types';

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return <EmployeeDetails params={{ id }} />;
};

export default Page;
