import Link from "next/link";

export const EmployeeForm = () => {
  return (
    <div>
      <p>Employee Form </p>
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-2xl font-bold">Add Employee</h1>
        <div className="flex items-center gap-1 text-sm">
          <Link href="/admin/employees" className="text-primary">
            {" "}
            All Employee{" "}
          </Link>
          <p className="text-muted-foreground"> &gt; Add New Employee</p>
        </div>
      </div>
    </div>
  );
};
