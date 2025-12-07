// import { AddEmployeeForm } from "@/modules/@org/admin/employee/_components/forms/add-employee";
import { EmployeeDetails } from "@/modules/@org/admin/employee";

const page = () => {
  return (
    <>
      <EmployeeDetails params={{ id: "1" }} />
    </>
  );
};

export default page;
