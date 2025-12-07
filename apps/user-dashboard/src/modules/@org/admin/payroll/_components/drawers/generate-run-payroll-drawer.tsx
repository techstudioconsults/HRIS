"use client";

import { formatCurrency, formatDate } from "@/lib/formatters";
import { CalendarModal } from "@/modules/@org/admin/payroll/_components/calendar-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@workspace/ui/components/drawer";
import { AlertModal, BackButton } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { cn } from "@workspace/ui/lib/utils";
import { Eye, EyeSlash } from "iconsax-reactjs";
import { CalendarIcon, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

import { DashboardCard } from "../../../dashboard/_components/dashboard-card";
import { usePayrollService } from "../../services/use-service";
import { usePayrollStore } from "../../stores/payroll-store";
import type { Payroll, PayrollApproval } from "../../types";

interface SchedulePayrollDrawerProperties {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  payrollId: string | null;
  summary?: Payroll;
  canRunNow?: boolean;
}

export const GenerateRunPayrollDrawer = ({
  open,
  onOpenChange,
  payrollId,
  summary,
  canRunNow = true,
}: SchedulePayrollDrawerProperties) => {
  const [isNetPayVisible, setIsNetPayVisible] = useState(false);
  const [isChangeDateModalOpen, setIsChangeDateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRunSubmittedAlertOpen, setIsRunSubmittedAlertOpen] = useState(false);
  const { setHideNotificationBanner, setPayrollSelectedDate } = usePayrollStore();

  const { useRunPayroll, useGetPayrollApprovals } = usePayrollService();
  const { mutateAsync: runPayroll, isPending: isRunningPayroll } = useRunPayroll();

  const payrollIdForApprovals = payrollId ?? "";
  const { data: approvalsResponse, isLoading: isApprovalsLoading } = useGetPayrollApprovals(payrollIdForApprovals, {
    enabled: !!payrollIdForApprovals,
  });
  const approvals = (approvalsResponse?.data ?? []) as PayrollApproval[];

  const totalEmployees = summary?.employeesInPayroll ?? 0;
  const totalPayroll = summary?.netPay ?? 0;
  const walletBalance = Number(summary?.walletBalance) ?? 0;
  const paymentDateLabel = summary?.paymentDate ? formatDate(summary.paymentDate) : "";
  const processingCharges = 0;
  const totalAmount = totalPayroll + processingCharges;
  const status = summary?.status !== `idle`;

  const router = useRouter();

  const handleRunPayroll = async () => {
    if (!payrollId) {
      toast.error("No payroll selected to run.");
      return;
    }

    await runPayroll(
      {
        payrollId,
        date: (selectedDate ?? new Date()).toISOString(),
      },
      {
        onSuccess: () => {
          setIsConfirmModalOpen(false);
          // Close the drawer after successful payroll run
          onOpenChange?.(false);

          // Show success alert after closing the drawer for a smooth transition
          setTimeout(() => {
            setIsRunSubmittedAlertOpen(true);
            setHideNotificationBanner(false);
            setPayrollSelectedDate(selectedDate);
          }, 300);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          const message = error?.response?.data?.message ?? "Failed to run payroll. Please try again.";
          toast.error("Something went wrong. ", {
            description: message,
          });
        },
      },
    );
  };

  // const handleSchedulePayment = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.stopPropagation();
  //   setIsChangeDateModalOpen(true);
  // };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} direction="right">
        <DrawerContent className="h-full w-full sm:!max-w-xl">
          <DrawerHeader className="border-b pb-4">
            <div className="flex items-center gap-10">
              <BackButton />
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                  <CalendarIcon className="size-5 text-blue-600" />
                </div>
                <div>
                  <DrawerTitle className="text-lg font-semibold">
                    Payroll Review{paymentDateLabel ? ` (${paymentDateLabel})` : ""}
                  </DrawerTitle>
                  {/* <DrawerDescription>Set up automated payroll processing</DrawerDescription> */}
                </div>
              </div>
            </div>
          </DrawerHeader>

          <section className="flex-1 space-y-6 overflow-y-auto p-6">
            <h1 className="text-xl font-bold">Summary Overview</h1>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DashboardCard
                title="Total Employees"
                value={<p className="text-base">{totalEmployees}</p>}
                className="bg-muted flex flex-col items-center justify-center gap-4 text-center shadow-none"
              />
              <DashboardCard
                title="Wallet Balance"
                value={
                  <div className="flex items-center gap-4">
                    <p className="text-base text-white">
                      {isNetPayVisible ? formatCurrency(Number(walletBalance)) : "••••••••"}
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
            <section className="bg-muted space-y-4 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-base">Total Payroll</p>
                <p className="text-foreground font-medium">{formatCurrency(totalPayroll)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-base">Processing Charges</p>
                <p className="text-foreground font-medium">{formatCurrency(processingCharges)}</p>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <p className="text-success">Total Amount</p>
                <p className="text-success">{formatCurrency(totalAmount)}</p>
              </div>
            </section>
            <div
              className={cn(
                "bg-accent/10 border-accent item-center flex gap-4 rounded-lg border p-4 text-sm text-gray-500",
                walletBalance >= totalAmount ? "hidden" : "",
              )}
            >
              <div className="size-8">
                <Info size={20} />
              </div>
              <p>
                Your current wallet balance is insufficient to complete this payroll. Please{" "}
                <Link href={"/"} className="font-semibold underline">
                  top up your wallet
                </Link>{" "}
                to proceed.
              </p>
            </div>
            <section>
              <h1 className="text-base font-bold">Approvers</h1>
              <section className="bg-muted space-y-4 rounded-lg p-4">
                {payrollId ? (
                  isApprovalsLoading ? (
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
                  )
                ) : (
                  <div className="text-muted-foreground text-sm">Select a payroll to view approvers.</div>
                )}
              </section>
            </section>
          </section>
          <div className="border-t p-6">
            <div className="flex gap-3">
              <MainButton
                variant="primary"
                type="button"
                className="flex-1"
                onClick={() => setIsConfirmModalOpen(true)}
                isDisabled={!canRunNow}
              >
                Run Payroll
              </MainButton>
              {/* <MainButton variant="outline" onClick={handleSchedulePayment} className="flex-1">
                Schedule Payment
              </MainButton> */}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Change Schedule Date Modal */}
      <CalendarModal
        open={isChangeDateModalOpen}
        onOpenChange={setIsChangeDateModalOpen}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        onContinue={(date) => {
          if (date) {
            setSelectedDate(date);
            setPayrollSelectedDate(date);
            setIsRunSubmittedAlertOpen(true);
            // Intentionally do NOT show the approval progress banner here;
            // it's displayed only after a successful Run Payroll action.

            // Here you can add logic to update the payroll schedule
          }
        }}
      />

      {/* Confirmation Modal */}
      <AlertModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleRunPayroll}
        loading={isRunningPayroll}
        type="warning"
        title="Confirm Payroll Run?"
        description="Once you proceed, payroll will be sent for approval. After all required approvers approve it, the funds will be disbursed to employees' accounts."
        confirmText="Yes, Run Payroll"
        cancelText="Cancel"
        confirmVariant="primary"
        cancelButtonClassName="border-destructive text-destructive"
      />

      {/* Run submitted success modal */}
      <AlertModal
        isOpen={isRunSubmittedAlertOpen}
        onClose={() => setIsRunSubmittedAlertOpen(false)}
        onConfirm={() => {
          setIsRunSubmittedAlertOpen(false);
          router.push("/admin/payroll");
        }}
        type="success"
        title="Payroll Submitted for Approval"
        description="Payroll is now pending approval. Once all required approvers approve it, salary disbursement will begin automatically."
        confirmText="Back to Payroll"
        showCancelButton={false}
        autoClose={false}
      />
    </>
  );
};
