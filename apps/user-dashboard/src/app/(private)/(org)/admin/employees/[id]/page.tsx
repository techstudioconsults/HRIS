// import { AddEmployeeForm } from "@/modules/@org/admin/employee/_components/forms/add-employee";
import { EmployeeDetails } from "@/modules/@org/admin/employee";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return (
    <>
      <EmployeeDetails
        params={{
          id,
        }}
      />
    </>
  );
};
export default page;
