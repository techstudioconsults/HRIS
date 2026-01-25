"use client";

import { AlertModal, BreadCrumb, FormField, MultiSelect } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useLeaveStore } from "../../stores/leave-store";
import type { CompanyLeavePolicy } from "../../types";

type LeaveSetupFormValues = {
  approvers: string[];
  requireManagerApproval: boolean;
  allowCarryOver: boolean;
  maxCarryOverDays: string;
};

type LeaveSetupType = {
  name: string;
  days: number | string;
  cycle: string;
  carryOver: boolean;
};

const DEFAULT_LEAVE_TYPES: LeaveSetupType[] = [
  { name: "Annual leave", days: 20, cycle: "Yearly", carryOver: false },
  { name: "Casual leave", days: "Not set", cycle: "Not set", carryOver: false },
  { name: "Sick leave", days: "Not set", cycle: "Not set", carryOver: false },
  { name: "Maternity leave", days: "Not set", cycle: "Not set", carryOver: false },
];

export const LeaveSetupLegacyForm = () => {
  const router = useRouter();
  const [isSubmittedAlertOpen, setIsSubmittedAlertOpen] = useState(false);
  const { setHasCompletedLeaveSetup, setShowLeaveSetupModal } = useLeaveStore();
  const policy = undefined as CompanyLeavePolicy | undefined;

  const [leaveTypes, setLeaveTypes] = useState<LeaveSetupType[]>(
    policy?.defaultLeaveTypes?.length ? (policy.defaultLeaveTypes as unknown as LeaveSetupType[]) : DEFAULT_LEAVE_TYPES,
  );

  const methods = useForm<LeaveSetupFormValues>({
    values: {
      approvers: [],
      requireManagerApproval: true,
      allowCarryOver: false,
      maxCarryOverDays: "5",
    },
  });

  // Transform employees to select options
  const employeeOptions = useMemo(() => {
    return [
      { value: "emp-1", label: "John Doe" },
      { value: "emp-2", label: "Jane Smith" },
    ];
  }, []);

  const handleAddLeaveType = () => {
    setLeaveTypes([...leaveTypes, { name: "", days: "Not set", cycle: "Not set", carryOver: false }]);
  };

  const handleRemoveLeaveType = (index: number) => {
    const updated = leaveTypes.filter((_, index_) => index_ !== index);
    setLeaveTypes(updated);
  };

  const handleLeaveTypeChange = (index: number, field: keyof LeaveSetupType, value: string | number | boolean) => {
    const updated = [...leaveTypes];
    updated[index] = { ...updated[index], [field]: value };
    setLeaveTypes(updated);
  };

  const onSubmit = async (data: LeaveSetupFormValues) => {
    void data;
    setIsSubmittedAlertOpen(true);
    setShowLeaveSetupModal(false);
    setHasCompletedLeaveSetup(true);
  };

  return (
    <section>
      <h1 className="text-2xl font-bold">Leave Setup</h1>
      <BreadCrumb items={[{ label: "Leave Hub", href: "/admin/leave" }, { label: "Setup" }]} className="mb-6" />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="space-y-10">
            {/* Leave Types Section */}
            <section data-tour="leave-types-section">
              <h2 className="mb-4 text-lg font-semibold">Leave Types</h2>
              <div className="space-y-4">
                {leaveTypes.map((leaveType, index) => (
                  <div key={index} className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-4">
                    <input
                      type="text"
                      placeholder="Leave Type"
                      value={leaveType.name}
                      onChange={(event) => handleLeaveTypeChange(index, "name", event.target.value)}
                      className="h-12 rounded-md border px-3"
                    />
                    <input
                      type="text"
                      placeholder="Days"
                      value={leaveType.days}
                      onChange={(event) => handleLeaveTypeChange(index, "days", event.target.value)}
                      className="h-12 rounded-md border px-3"
                    />
                    <input
                      type="text"
                      placeholder="Cycle"
                      value={leaveType.cycle}
                      onChange={(event) => handleLeaveTypeChange(index, "cycle", event.target.value)}
                      className="h-12 rounded-md border px-3"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={leaveType.carryOver}
                          onChange={(event) => handleLeaveTypeChange(index, "carryOver", event.target.checked)}
                        />
                        <span className="text-sm">Carry Over</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveLeaveType(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                <MainButton type="button" variant="outline" onClick={handleAddLeaveType} className="w-full">
                  + Add Leave Type
                </MainButton>
              </div>
            </section>

            {/* Approvers Section */}
            <section data-tour="leave-approvers">
              <h2 className="mb-4 text-lg font-semibold">Leave Approvers</h2>
              <div className="space-y-4">
                <MultiSelect
                  name="approvers"
                  label="Select Approvers"
                  placeholder="Select employees who can approve leave"
                  options={employeeOptions}
                  className="w-full"
                />

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" {...methods.register("requireManagerApproval")} />
                    <span className="text-sm">Require manager approval for all leave requests</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" {...methods.register("allowCarryOver")} />
                    <span className="text-sm">Allow unused leave days to carry over to next cycle</span>
                  </label>
                </div>

                {methods.watch("allowCarryOver") && (
                  <FormField
                    name="maxCarryOverDays"
                    label="Maximum Carry Over Days"
                    placeholder="Enter max days"
                    type="text"
                    className="!h-14 w-full md:w-1/2"
                  />
                )}
              </div>
            </section>

            {/* Submit Section */}
            <div className="flex gap-4">
              <MainButton type="submit" variant="primary">
                Save Leave Setup
              </MainButton>
              <MainButton type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </MainButton>
            </div>
          </div>
        </form>
      </FormProvider>

      {/* Success Alert */}
      <AlertModal
        isOpen={isSubmittedAlertOpen}
        onClose={() => setIsSubmittedAlertOpen(false)}
        type="success"
        title="Leave Setup Complete!"
        description="Your leave management system has been configured successfully. You can now manage leave requests and balances."
        confirmText="Go to Leave Hub"
        cancelText="Close"
        onConfirm={() => {
          setIsSubmittedAlertOpen(false);
          router.push("/admin/leave");
        }}
      />
    </section>
  );
};
