import { EmployeeDetails } from '@/modules/@org/admin/employee';

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return <EmployeeDetails params={{ id }} />;
};

export default Page;
