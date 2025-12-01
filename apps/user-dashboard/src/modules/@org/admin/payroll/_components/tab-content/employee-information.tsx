import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import { MainButton } from "@workspace/ui/lib/button";

import type { Payslip } from "../../types";

interface EmployeeInformationProperties {
  payslip?: Payslip | null;
}

const EmployeeInformation = ({ payslip }: EmployeeInformationProperties) => {
  const employee = payslip?.employee;

  const employeeInfo = {
    fullName: employee?.name ?? "-",
    employeeId: employee?.id ?? "-",
    department: employee?.team?.name ?? "-",
    role: employee?.role?.name ?? "-",
    workType: employee?.workMode ?? "-",
    employeeType: employee?.employmentType ?? "-",
    status: employee?.status ?? "-",
  };

  return (
    <div className="space-y-10">
      <Card className="rounded-2xl border shadow-none">
        <CardContent className="space-y-4">
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground text-lg">Full Name</dt>
              <dd className="text-foreground text-base font-medium">{employeeInfo.fullName}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground text-lg">Employee ID</dt>
              <dd className="text-foreground text-base font-medium">{employeeInfo.employeeId}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground text-lg">Department</dt>
              <dd className="text-foreground text-base font-medium">{employeeInfo.department}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground text-lg">Role</dt>
              <dd className="text-foreground text-base font-medium">{employeeInfo.role}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground text-lg">Work Type</dt>
              <dd className="text-foreground text-base font-medium">{employeeInfo.workType}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground text-lg">Employee Type</dt>
              <dd className="text-foreground text-base font-medium">{employeeInfo.employeeType}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground text-lg">Status</dt>
              <dd>
                <Badge variant="success">{employeeInfo.status}</Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <MainButton
        variant="primary"
        size="xl"
        className="w-full"
        href={employee ? `/admin/employees/${employee.id}` : undefined}
        isDisabled={!employee}
      >
        View Full Profile
      </MainButton>
    </div>
  );
};

export default EmployeeInformation;
