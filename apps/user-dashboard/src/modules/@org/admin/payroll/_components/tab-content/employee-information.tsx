import { Badge } from '@workspace/ui/components/badge';
import { Card, CardContent } from '@workspace/ui/components/card';
import { MainButton } from '@workspace/ui/lib/button';

import type { Payslip } from '../../types';

interface EmployeeInformationProperties {
  payslip?: Payslip | null;
}

const EmployeeInformation = ({ payslip }: EmployeeInformationProperties) => {
  const employee = payslip?.employee;

  const employeeInfo = {
    fullName: employee?.name ?? '-',
    employeeId: employee?.id ?? '-',
    department: employee?.team?.name ?? '-',
    role: employee?.role?.name ?? '-',
    workType: employee?.workMode ?? '-',
    employeeType: employee?.employmentType ?? '-',
    status: employee?.status ?? '-',
  };

  return (
    <div className="space-y-10">
      <Card className="border shadow-none">
        <CardContent className="">
          <dl className="space-y-8 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground truncate">Full Name</dt>
              <dd className="text-foreground truncate font-medium">
                {employeeInfo.fullName}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground truncate">Employee ID</dt>
              <dd className="text-foreground truncate font-medium">
                {employeeInfo.employeeId}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground truncate">Department</dt>
              <dd className="text-foreground truncate font-medium">
                {employeeInfo.department}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground truncate">Role</dt>
              <dd className="text-foreground truncate font-medium">
                {employeeInfo.role}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground truncate">Work Type</dt>
              <dd className="text-foreground truncate font-medium">
                {employeeInfo.workType}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground truncate">Employee Type</dt>
              <dd className="text-foreground truncate font-medium">
                {employeeInfo.employeeType}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Status</dt>
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
