"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardFooter } from "@workspace/ui/components/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@workspace/ui/components/drawer";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { BackButton } from "@workspace/ui/lib";
import { User } from "iconsax-reactjs";

import Loading from "../../../../../../../note/loading";
import { usePayrollService } from "../../services/use-service";
import { usePayrollStore } from "../../stores/payroll-store";
import EmployeeInformation from "../tab-content/employee-information";
import { SalaryDetails } from "../tab-content/salary-details";

interface EmployeeInformationDrawerProperties {
  /**
   * The currently selected payroll period identifier.
   * Optional so the drawer can still be rendered in places
   * where a payroll context is not yet available.
   */
  payrollId?: string | null;
}

export const EmployeeInformationDrawer = ({ payrollId }: EmployeeInformationDrawerProperties) => {
  const {
    showEmployeeInformationDrawer,
    setShowEmployeeInformationDrawer,
    selectedPayslipId,
    employeeInformationActiveTab,
    setEmployeeInformationActiveTab,
  } = usePayrollStore();
  const { useGetPayslipById } = usePayrollService();

  const { data: payslipResponse, isLoading } = useGetPayslipById(payrollId ?? "", selectedPayslipId || "", {
    enabled: !!payrollId && !!selectedPayslipId,
  });

  const payslip = payslipResponse?.data ?? null;

  const titleText =
    payslip?.employee?.name && payslip?.paymentDate
      ? `Payroll Review (${new Date(payslip.paymentDate).toLocaleDateString(undefined, {
          month: "long",
          year: "numeric",
        })}) - ${payslip.employee.name}`
      : "Payroll Review";

  return (
    <>
      <Drawer open={showEmployeeInformationDrawer} onOpenChange={setShowEmployeeInformationDrawer} direction="right">
        <DrawerContent className="h-full !w-full sm:!max-w-xl md:!max-w-3xl">
          <DrawerHeader className="border-b pb-4">
            <div className="flex items-center gap-10">
              <BackButton />
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                  <User className="size-5 text-blue-600" />
                </div>
                <div>
                  <DrawerTitle className="text-lg font-semibold">{titleText}</DrawerTitle>
                  {/* <DrawerDescription>Set up automated payroll processing</DrawerDescription> */}
                </div>
              </div>
            </div>
          </DrawerHeader>

          <section className="flex-1 space-y-6 overflow-y-auto p-10">
            <div className="space-y-6">
              <Tabs
                value={employeeInformationActiveTab}
                onValueChange={(value) =>
                  setEmployeeInformationActiveTab(
                    value as "employee-information" | "salary-details" | "payroll-history",
                  )
                }
                className="w-full"
              >
                <TabsList className="w-full bg-transparent">
                  <TabsTrigger value="employee-information">Employee Infomation</TabsTrigger>
                  <TabsTrigger value="salary-details">Salary Details</TabsTrigger>
                  <TabsTrigger className="" value="payroll-history">
                    Payroll History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="employee-information" className="mt-6 space-y-6">
                  {isLoading || !payslip ? (
                    <div className="py-10">
                      <Loading text="Loading employee information..." />
                    </div>
                  ) : (
                    <EmployeeInformation payslip={payslip} />
                  )}
                </TabsContent>

                <TabsContent value="salary-details" className="mt-6 space-y-8">
                  <SalaryDetails payslip={payslip} />
                </TabsContent>

                <TabsContent value="payroll-history" className="mt-6 space-y-6">
                  <Card className="rounded-2xl border shadow-none">
                    <CardContent className="px-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Month</TableHead>
                            <TableHead>Payment Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Net Paid</TableHead>
                            <TableHead className="text-right">Payslip</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Jun 2025</TableCell>
                            <TableCell>25/6/2025</TableCell>
                            <TableCell>
                              <Badge variant="success">Confirmed</Badge>
                            </TableCell>
                            <TableCell className="text-success font-medium">₦300,000</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="text-muted-foreground">
                                ...
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>May 2025</TableCell>
                            <TableCell>25/6/2025</TableCell>
                            <TableCell>
                              <Badge variant="success">Confirmed</Badge>
                            </TableCell>
                            <TableCell className="text-success font-medium">₦300,000</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="text-muted-foreground">
                                ...
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Apr 2025</TableCell>
                            <TableCell>25/6/2025</TableCell>
                            <TableCell>
                              <Badge variant="success">Confirmed</Badge>
                            </TableCell>
                            <TableCell className="text-success font-medium">₦300,000</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="text-muted-foreground">
                                ...
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Mar 2025</TableCell>
                            <TableCell>25/6/2025</TableCell>
                            <TableCell>
                              <Badge variant="success">Confirmed</Badge>
                            </TableCell>
                            <TableCell className="text-success font-medium">₦300,000</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="text-muted-foreground">
                                ...
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Feb 2025</TableCell>
                            <TableCell>25/6/2025</TableCell>
                            <TableCell>
                              <Badge variant="success">Confirmed</Badge>
                            </TableCell>
                            <TableCell className="text-success font-medium">₦300,000</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="text-muted-foreground">
                                ...
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>

                    <CardFooter className="text-muted-foreground flex flex-col items-center justify-between gap-4 border-t py-4 text-xs sm:flex-row">
                      <div className="flex flex-wrap items-center gap-2">
                        <span>10 entries per page</span>
                        <span className="text-border hidden sm:inline">|</span>
                        <span>Page 1 of 1</span>
                      </div>

                      <Pagination className="w-auto justify-center sm:justify-end">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious href="#" />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationNext href="#" />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </section>
          <div className="border-t p-6"></div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
