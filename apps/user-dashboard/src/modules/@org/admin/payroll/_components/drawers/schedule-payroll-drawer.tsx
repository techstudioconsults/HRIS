"use client";

import { formatCurrency, formatDate } from "@/lib/formatters";
import { CalendarModal } from "@/modules/@org/admin/payroll/_components/calendar-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer";
import { BackButton, EmptyState } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { cn } from "@workspace/ui/lib/utils";
import { AxiosError } from "axios";
import { Eye, EyeSlash } from "iconsax-reactjs";
import { CalendarIcon, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";

import empty1 from "~/images/empty-state.svg";
import { DashboardCard } from "../../../dashboard/_components/dashboard-card";
import { usePayrollService } from "../../services/use-service";
import { usePayrollStore } from "../../stores/payroll-store";
import type { Payroll, PayrollApproval } from "../../types";

// Pure helpers (moved to module scope to satisfy lint rule requiring outer scope for arrow functions)
const normalizeStatus = (status?: string) => (status || "").toLowerCase();
const getStatusBadgeClasses = (status?: string) => {
  const value = normalizeStatus(status);
  if (value.includes("await")) return "bg-warning-50 text-warning";
  if (value.includes("reject") || value.includes("decline")) return "bg-destructive-50 text-destructive";
  if (value.includes("complete")) return "bg-success-50 text-success";
  if (value.includes("disbursed")) return "bg-success-50 text-success"; // treat disbursed as success
  if (value.includes("approve")) return "bg-blue-50 text-blue-600";
  return "bg-muted text-foreground";
};
const getStatusBanner = (status?: string, date?: string): { message: string; classes: string } => {
  const value = normalizeStatus(status);
  const formattedDate = date ? formatDate(date) : "this period";
  if (value.includes("await"))
    return {
      message: `Payroll for ${formattedDate} is awaiting approvals. Approvers must act before disbursement can begin.`,
      classes: "border-warning-200 bg-warning-50",
    };
  if (value.includes("approve"))
    return {
      message: `Payroll for ${formattedDate} has been approved and is queued for processing/disbursement.`,
      classes: "border-blue-200 bg-blue-50",
    };
  if (value.includes("disburs"))
    return {
      message: `Payroll for ${formattedDate} is currently being disbursed to employee accounts.`,
      classes: "border-success-200 bg-success-50",
    };
  if (value.includes("complete"))
    return {
      message: `Payroll for ${formattedDate} has been completed successfully.`,
      classes: "border-success-200 bg-success-50",
    };
  if (value.includes("reject") || value.includes("decline"))
    return {
      message: `Payroll for ${formattedDate} was rejected. Adjust the payroll or approvers then re-run.`,
      classes: "border-destructive-200 bg-destructive-50",
    };
  return {
    message: `Payroll is scheduled for ${formattedDate}. You can reschedule or cancel before processing begins.`,
    classes: "border-accent bg-accent/10",
  };
};

export const SchedulePayrollDrawer = () => {
  const router = useRouter();
  const { useGetCompanyWallet, useGetAllPayrolls, useCreatePayroll, useGetPayrollApprovals } = usePayrollService();
  const { data: companyWallet } = useGetCompanyWallet();
  const [isNetPayVisible, setIsNetPayVisible] = useState(false);
  const [isChangeDateModalOpen, setIsChangeDateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedPayrollId, setSelectedPayrollId] = useState<string | null>(null);
  const { showSchedulePayrollDrawer, setShowSchedulePayrollDrawer } = usePayrollStore();

  // Load available generated payrolls when drawer is open
  const { data: payrollsResponse, isLoading: isPayrollsLoading, refetch: refetchPayrolls } = useGetAllPayrolls();

  // Normalize response to array (supports both summary and payroll shapes)
  type ListPayroll = Pick<Payroll, "id" | "policyId" | "netPay" | "employeesInPayroll" | "paymentDate"> & {
    status?: string;
    name?: string;
    role?: string;
    grossPay?: number;
    bonus?: number;
    deduction?: number;
  };

  const payrolls: ListPayroll[] = useMemo(() => {
    const shaped = payrollsResponse as unknown as { data?: ListPayroll[]; items?: ListPayroll[] } | undefined;
    const data = shaped?.data ?? shaped?.items ?? [];
    return Array.isArray(data) ? data : [];
    24 / 11 / 2025;
  }, [payrollsResponse]);

  // Sort by payment date (default: earliest first)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const sortedPayrolls = useMemo(() => {
    const array = [...payrolls];
    array.sort((a, b) => {
      const aTime = new Date(a.paymentDate).getTime();
      const bTime = new Date(b.paymentDate).getTime();
      return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
    });
    return array;
  }, [payrolls, sortDirection]);

  const selectedPayroll = useMemo(() => {
    return payrolls.find((p) => p.id === selectedPayrollId) ?? null;
  }, [payrolls, selectedPayrollId]);

  const status = selectedPayroll?.status !== `idle`;

  const statusBanner = getStatusBanner(selectedPayroll?.status, selectedPayroll?.paymentDate);

  const payrollIdForApprovals = selectedPayroll?.id ?? "";
  const { data: approvalsResponse, isLoading: isApprovalsLoading } = useGetPayrollApprovals(payrollIdForApprovals, {
    enabled: !!payrollIdForApprovals,
  });
  const approvals = (approvalsResponse?.data ?? []) as PayrollApproval[];

  const { mutateAsync: createPayroll, isPending: isCreatingPayroll } = useCreatePayroll();

  const handleDateSelection = async (date: Date | undefined) => {
    if (!date) {
      toast.error("Please select a date to continue.");
      return;
    }

    setSelectedDate(date);

    await createPayroll(
      { paymentDate: date.toISOString() },
      {
        onSuccess: () => {
          toast.success("Payroll scheduled successfully.", {
            description: `Payroll has been scheduled for ${formatDate(date.toISOString())}.`,
          });
          setIsChangeDateModalOpen(false);
          refetchPayrolls();
        },
        onError: (error) => {
          const axiosError = error as AxiosError<{ message?: string }>;
          const message = axiosError.response?.data?.message ?? "Failed to schedule payroll.";
          toast.error("Something went wrong", {
            description: message,
            action: {
              label: "Payroll Settings",
              onClick: () => {
                router.push("/admin/payroll/setup");
              },
            },
          });
        },
      },
    );
  };

  return (
    <>
      <Drawer open={showSchedulePayrollDrawer} onOpenChange={setShowSchedulePayrollDrawer} direction="right">
        <DrawerContent className="h-full w-full sm:!max-w-xl">
          <DrawerHeader className="border-b pb-4">
            <div className="flex items-center gap-10">
              <BackButton />
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                  <CalendarIcon className="size-5 text-blue-600" />
                </div>
                <div>
                  <DrawerTitle className="text-lg font-semibold">Schedule Payroll</DrawerTitle>
                  <DrawerDescription>Set up automated payroll processing</DrawerDescription>
                </div>
              </div>
            </div>
          </DrawerHeader>

          <section className="flex-1 space-y-6 overflow-y-auto p-6">
            {selectedPayroll === null ? (
              <>
                <h1 className="text-xl font-bold">Scheduled Payroll</h1>
                {isPayrollsLoading ? (
                  <div className="text-muted-foreground flex h-64 items-center justify-center">Loading...</div>
                ) : payrolls.length === 0 ? (
                  <EmptyState
                    className="bg-background gap-0"
                    images={[{ src: empty1.src, alt: "No payroll summary", width: 80, height: 80 }]}
                    description="No scheduled payrolls yet."
                    titleClassName="text-xl font-bold"
                  />
                ) : (
                  <section className="space-y-2">
                    <div className="">
                      <div className="w-full overflow-x-auto">
                        <table className="w-full table-auto border-collapse text-sm">
                          <thead className="bg-muted/50">
                            <tr className="text-left">
                              <th className="border px-4 py-2">
                                <button
                                  type="button"
                                  onClick={() => setSortDirection((previous) => (previous === "asc" ? "desc" : "asc"))}
                                  className="flex items-center gap-1 underline-offset-4 hover:underline"
                                >
                                  Payment Date
                                  <span className="text-muted-foreground text-xs">
                                    {sortDirection === "asc" ? "↑" : "↓"}
                                  </span>
                                </button>
                              </th>
                              <th className="border px-4 py-2">Employees</th>
                              <th className="border px-4 py-2">Net Pay</th>
                              <th className="border px-4 py-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedPayrolls.map((p) => (
                              <tr
                                key={p.id}
                                className="hover:bg-muted/50 cursor-pointer"
                                onClick={() => setSelectedPayrollId(p.id)}
                              >
                                <td className="border px-4 py-2">{formatDate(p.paymentDate)}</td>
                                <td className="border px-4 py-2">{p.employeesInPayroll ?? 0}</td>
                                <td className="border px-4 py-2">{formatCurrency(p.netPay ?? 0)}</td>
                                {/* <td className="px-4 py-2">{p.policyId}</td>
                                <td className="px-4 py-2">{p.id}</td> */}
                                <td className="border px-4 py-2">
                                  <Badge className={cn("rounded-full px-3 py-1", getStatusBadgeClasses(p.status))}>
                                    {p.status ?? "-"}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold">Summary Overview</h1>
                  <button
                    type="button"
                    onClick={() => setSelectedPayrollId(null)}
                    className="text-primary text-sm underline-offset-4 hover:underline"
                  >
                    Back to list
                  </button>
                </div>
                <div className={cn("item-center flex gap-4 rounded-lg border p-4 text-sm", statusBanner.classes)}>
                  <Info size={16} />
                  <p className="leading-relaxed">{statusBanner.message}</p>
                </div>
                <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <DashboardCard
                    title="Total Employees"
                    value={<p className="text-base">{selectedPayroll?.employeesInPayroll ?? 0}</p>}
                    className="bg-muted flex flex-col items-center justify-center gap-4 text-center shadow-none"
                  />
                  <DashboardCard
                    title="Wallet Balance"
                    value={
                      <div className="flex items-center gap-4">
                        <p className="text-base text-white">
                          {isNetPayVisible ? formatCurrency(companyWallet?.data?.balance || 0) : `••••••••`}
                        </p>
                        <button
                          onClick={() => setIsNetPayVisible(!isNetPayVisible)}
                          className="text-white transition-colors hover:text-gray-300"
                          aria-label={isNetPayVisible ? "Hide net pay" : "Show net pay"}
                        >
                          {isNetPayVisible ? (
                            <EyeSlash className="text-white" size={30} />
                          ) : (
                            <Eye className="text-white" size={30} />
                          )}
                        </button>
                      </div>
                    }
                    className="flex flex-col items-center justify-center gap-4 bg-gradient-to-r from-[#013E94] to-[#00132E] text-center"
                    titleColor="text-white"
                  />
                </section>
                <section className="bg-muted space-y-2 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Gross Pay</p>
                    <p className="text-foreground font-medium">{formatCurrency(selectedPayroll?.grossPay ?? 0)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Total Bonuses</p>
                    <p className="text-foreground font-medium">{formatCurrency(selectedPayroll?.bonus ?? 0)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Total Deductions</p>
                    <p className="text-foreground font-medium">{formatCurrency(selectedPayroll?.deduction ?? 0)}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 font-bold">
                    <p className="text-success">Net Pay</p>
                    <p className="text-success">{formatCurrency(selectedPayroll?.netPay ?? 0)}</p>
                  </div>
                </section>
                <section>
                  <h1 className="text-xl font-bold">Approvers</h1>
                  <section className="bg-muted space-y-4 rounded-lg p-4">
                    {isApprovalsLoading ? (
                      <div className="text-muted-foreground text-sm">Loading approvers...</div>
                    ) : approvals.length === 0 ? (
                      <div className="text-muted-foreground text-sm">No approvers configured for this payroll.</div>
                    ) : (
                      approvals.map((approval) => {
                        const name = approval.employee.name ?? "Approver";
                        const role = (approval.approverRole as ReactNode) ?? <></>;
                        const initials =
                          name
                            .split(" ")
                            .map((part) => part.charAt(0))
                            .join("")
                            .toUpperCase()
                            .slice(0, 2) || "AP";
                        const statusLabel =
                          approval.status && approval.status.length > 0
                            ? approval.status.charAt(0).toUpperCase() + approval.status.slice(1)
                            : "Pending";

                        return (
                          <section key={approval.payrollId} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarImage
                                  src={approval.employee.avatar ?? "https://github.com/shadcn.png"}
                                  alt={name}
                                />
                                <AvatarFallback>{initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-foreground text-sm font-medium">{name}</p>
                                {role ? <p className="text-xs text-gray-500">{role}</p> : null}
                              </div>
                            </div>
                            {status && (
                              <Badge
                                className={cn(
                                  `rounded-full px-4 py-2`,
                                  statusLabel === "Pending" && "bg-warning-50 text-warning",
                                  statusLabel === "Approved" && "bg-success-50 text-success",
                                  statusLabel === "Declined" && "bg-destructive-50 text-destructive",
                                )}
                              >
                                {statusLabel}
                              </Badge>
                            )}
                          </section>
                        );
                      })
                    )}
                  </section>
                </section>
              </>
            )}
          </section>
          <DrawerFooter className="border-t p-6">
            <div className="flex gap-3">
              <MainButton
                variant="outline"
                // onClick={() => onOpenChange(false)}
                className="border-destructive text-destructive flex-1"
              >
                Cancel
              </MainButton>
              <MainButton
                variant="primary"
                type="button"
                onClick={() => setIsChangeDateModalOpen(true)}
                className="flex-1"
              >
                Schedule Payroll
              </MainButton>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Change Schedule Date Modal */}
      <CalendarModal
        open={isChangeDateModalOpen}
        onOpenChange={setIsChangeDateModalOpen}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        onContinue={handleDateSelection}
        isSubmitting={isCreatingPayroll}
      />
    </>
  );
};
