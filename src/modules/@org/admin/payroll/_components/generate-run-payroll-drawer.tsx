"use client";

import { BackButton } from "@/components/shared/back-button";
import MainButton from "@/components/shared/button";
import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { CalendarModal } from "@/modules/@org/admin/payroll/_components/calendar-modal";
import { Eye, EyeSlash } from "iconsax-reactjs";
import { CalendarIcon, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DashboardCard } from "../../dashboard/_components/dashboard-card";
import { usePayrollStore } from "../stores/payroll-store";

interface SchedulePayrollDrawerProperties {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const GenerateRunPayrollDrawer = ({ open, onOpenChange }: SchedulePayrollDrawerProperties) => {
  const [isNetPayVisible, setIsNetPayVisible] = useState(false);
  const [isChangeDateModalOpen, setIsChangeDateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isPayrollRunning, setIsPayrollRunning] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRunSubmittedAlertOpen, setIsRunSubmittedAlertOpen] = useState(false);
  const { setHideNotificationBanner, setPayrollSelectedDate, setTogglePayrollAction } = usePayrollStore();

  const router = useRouter();

  const handleRunPayroll = async () => {
    setIsPayrollRunning(true);
    setIsConfirmModalOpen(false);
    try {
      // Add your payroll run logic here
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Close the drawer after successful payroll run
      onOpenChange(false);
      // Show success alert after closing the drawer for a smooth transition
      setTimeout(() => {
        setIsRunSubmittedAlertOpen(true);
        setHideNotificationBanner(false);
        setPayrollSelectedDate(selectedDate);
      }, 300);
    } catch {
      // Handle error appropriately
    } finally {
      setIsPayrollRunning(false);
    }
  };

  const handleSchedulePayment = () => {
    setIsChangeDateModalOpen(true);
  };

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
                  <DrawerTitle className="text-lg font-semibold">Payroll Review(July Cycle)</DrawerTitle>
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
                value={<p className="text-base">{98}</p>}
                className="flex flex-col items-center justify-center gap-4 text-center"
              />
              <DashboardCard
                title="Wallet Balance"
                value={
                  <div className="flex items-center gap-4">
                    <p className="text-base text-white">{isNetPayVisible ? `N7,200,000` : `••••••••`}</p>
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
            <section className="space-y-4 rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between">
                <p>Total Payroll</p>
                <p>N10000</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Processing Charges</p>
                <p>N10000</p>
              </div>
              <div className="flex items-center justify-between font-bold">
                <p>Total Amount</p>
                <p>N10000</p>
              </div>
            </section>
            <div className="bg-accent/10 border-accent item-center flex gap-4 rounded-lg border p-4 text-sm text-gray-500">
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
              <h1 className="text-xl font-bold">Approvers</h1>
              <section className="space-y-8 rounded-lg p-4 shadow-md">
                <section className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-foreground">Ifijeh Kingsley</p>
                      <p className="text-xs text-gray-500">HR Manager</p>
                    </div>
                  </div>
                  <Badge className="bg-accent/10 border-accent text-accent rounded-full px-4 py-2">Pending</Badge>
                </section>
                <section className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-foreground">Ifijeh Kingsley</p>
                      <p className="text-xs text-gray-500">HR Manager</p>
                    </div>
                  </div>
                  <Badge className="bg-accent/10 border-accent text-accent rounded-full px-4 py-2">Pending</Badge>
                </section>
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
              >
                Run Payroll
              </MainButton>
              <MainButton variant="outline" onClick={handleSchedulePayment} className="flex-1">
                Schedule Payment
              </MainButton>
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
            setTogglePayrollAction("SCHEDULE");
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
        loading={isPayrollRunning}
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
