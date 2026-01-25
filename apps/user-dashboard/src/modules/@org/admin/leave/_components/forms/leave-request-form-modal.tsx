"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@workspace/ui/components/calendar";
import { FormField } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { ReusableDialog } from "@workspace/ui/lib/dialog/Dialog";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Form Schema
const leaveRequestSchema = z
  .object({
    employeeId: z.string().min(1, "Employee is required"),
    leaveTypeId: z.string().min(1, "Leave type is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z.string().min(10, "Reason must be at least 10 characters"),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    },
  );

type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>;

interface LeaveRequestFormModalProperties {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeaveRequestFormModal({ open, onOpenChange }: LeaveRequestFormModalProperties) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const methods = useForm<LeaveRequestFormData>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      employeeId: "",
      leaveTypeId: "",
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  const { handleSubmit, setValue, reset } = methods;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      reset();
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [open, reset]);

  // Update form values when dates change
  useEffect(() => {
    if (startDate) {
      setValue("startDate", startDate.toISOString().split("T")[0]);
    }
  }, [startDate, setValue]);

  useEffect(() => {
    if (endDate) {
      setValue("endDate", endDate.toISOString().split("T")[0]);
    }
  }, [endDate, setValue]);

  const handleFormSubmit = async (data: LeaveRequestFormData) => {
    setIsSubmitting(true);
    // Demo-only: simulate successful submission
    void data;
    toast.success("Leave request submitted (demo only)");
    onOpenChange(false);
    reset();
    setStartDate(undefined);
    setEndDate(undefined);
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    reset();
    setStartDate(undefined);
    setEndDate(undefined);
    onOpenChange(false);
  };

  // Prepare employee options
  const employeeOptions = [
    { label: "John Doe", value: "emp-1" },
    { label: "Jane Smith", value: "emp-2" },
  ];

  // Prepare leave type options
  const leaveTypeOptions = [
    { label: "Annual Leave (20 days)", value: "leave-type-1" },
    { label: "Sick Leave (10 days)", value: "leave-type-2" },
  ];

  return (
    <ReusableDialog
      trigger={""}
      open={open}
      onOpenChange={onOpenChange}
      title="New Leave Request"
      className="!max-w-2xl"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit(handleFormSubmit)(event);
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              name="employeeId"
              label="Employee"
              placeholder="Select employee"
              type="select"
              className="!h-14 w-full"
              options={employeeOptions}
              disabled={isSubmitting}
            />

            <FormField
              name="leaveTypeId"
              label="Leave Type"
              placeholder="Select leave type"
              type="select"
              className="!h-14 w-full"
              options={leaveTypeOptions}
              disabled={isSubmitting}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowStartCalendar(!showStartCalendar)}
                    className="flex h-14 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-left text-sm hover:border-gray-400"
                  >
                    <span className={startDate ? "text-gray-900" : "text-gray-500"}>
                      {startDate ? startDate.toLocaleDateString() : "Select start date"}
                    </span>
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                  </button>
                  {showStartCalendar && (
                    <div className="absolute z-50 mt-2 rounded-md border bg-white p-3 shadow-lg">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          setShowStartCalendar(false);
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEndCalendar(!showEndCalendar)}
                    className="flex h-14 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-left text-sm hover:border-gray-400"
                  >
                    <span className={endDate ? "text-gray-900" : "text-gray-500"}>
                      {endDate ? endDate.toLocaleDateString() : "Select end date"}
                    </span>
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                  </button>
                  {showEndCalendar && (
                    <div className="absolute z-50 mt-2 rounded-md border bg-white p-3 shadow-lg">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date);
                          setShowEndCalendar(false);
                        }}
                        disabled={(date) => date < (startDate || new Date(new Date().setHours(0, 0, 0, 0)))}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <FormField
              name="reason"
              label="Reason"
              placeholder="Enter reason for leave request"
              type="textarea"
              className="min-h-24 w-full"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <MainButton
              className="w-full"
              type="button"
              variant="outline"
              onClick={handleCancel}
              isDisabled={isSubmitting}
            >
              Cancel
            </MainButton>
            <MainButton
              className="w-full"
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </MainButton>
          </div>
        </form>
      </FormProvider>
    </ReusableDialog>
  );
}
