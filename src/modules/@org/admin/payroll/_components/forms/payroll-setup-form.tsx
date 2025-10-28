// import { zodResolver } from "@hookform/resolvers/zod";
"use client";

import { BreadCrumb } from "@/components/shared/breadcrumb";
import MainButton from "@/components/shared/button";
import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { FormField, MultiSelect } from "@/components/shared/inputs/FormFields";
import { useEmployeeService } from "@/modules/@org/admin/employee/services/use-service";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { usePayrollService } from "../../services/use-service";
import type { CompanyPayrollPolicy, PayrollBonusDeduction } from "../../types";
import { BonusDeductionManager } from "../bonus-deduction-manager";

// Extend API bonus/deduction type to cover backend field variants without using any
type APIBonusDeduction = PayrollBonusDeduction & {
  createdAt?: string;
  updatedAt?: string;
  amount?: number;
  value?: number;
};

type PayrollSetupFormValues = {
  payday: string;
  frequency: string;
  currency: string;
  approvers: string[];
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export const PayrollSetupForm = () => {
  const router = useRouter();
  const [isSubmittedAlertOpen, setIsSubmittedAlertOpen] = useState(false);

  // Fetch company payroll policy (needed to set form values directly via useForm)
  const { useGetCompanyPayrollPolicy } = usePayrollService();
  const { data: policyData } = useGetCompanyPayrollPolicy({
    staleTime: 0,
    refetchOnMount: true,
  });

  const policy = policyData?.data as CompanyPayrollPolicy | undefined;

  const methods = useForm<PayrollSetupFormValues>({
    // resolver: zodResolver(schema),
    defaultValues: {
      payday: "0",
      frequency: "",
      currency: "",
      approvers: [],
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
    // Set values directly from API response; RHF will update when `policy` changes
    values: policy
      ? {
          payday: String(policy.payday ?? "0"),
          frequency: policy.frequency ?? "",
          currency: policy.currency ?? "",
          approvers: policy.approvers ?? [],
          firstName: policy.firstName ?? "",
          lastName: policy.lastName ?? "",
          email: policy.email ?? "",
          phoneNumber: policy.phoneNumber ?? "",
        }
      : undefined,
  });

  // Fetch employees for approval dropdown
  const { useGetAllEmployees } = useEmployeeService();
  const { data: employeesData } = useGetAllEmployees(
    {},
    {
      staleTime: 0,
      refetchOnMount: true,
    },
  );

  // Build select options ensuring the current policy values exist so the value renders
  const frequencyOptions = useMemo(() => {
    const base = [
      { value: "weekly", label: "Weekly" },
      { value: "bi-weekly", label: "Bi-weekly" },
      { value: "monthly", label: "Monthly" },
    ];
    const current = (policyData?.data as CompanyPayrollPolicy | undefined)?.frequency;
    if (current && !base.some((o) => o.value === current)) {
      const titleCased = current
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return [{ value: current, label: titleCased }, ...base];
    }
    return base;
  }, [policyData]);

  const currencyOptions = useMemo(() => {
    const base = [
      { value: "USD", label: "USD" },
      { value: "EUR", label: "EUR" },
      { value: "NGN", label: "NGN" },
      { value: "GBP", label: "GBP" },
    ];
    const current = (policyData?.data as CompanyPayrollPolicy | undefined)?.currency;
    if (current && !base.some((o) => o.value === current)) {
      return [{ value: current, label: current }, ...base];
    }
    return base;
  }, [policyData]);

  const paydayOptions = useMemo(() => {
    const days = Array.from({ length: 31 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }));
    // 0 often represents "End of month" or a special rule; include so current value displays
    const withZero = [{ value: "0", label: "End of month" }, ...days];
    const current = String((policyData?.data as CompanyPayrollPolicy | undefined)?.payday ?? "");
    if (current && !withZero.some((o) => o.value === current)) {
      return [{ value: current, label: current }, ...withZero];
    }
    return withZero;
  }, [policyData]);

  // Transform employees to select options
  const employeeOptions = useMemo(() => {
    if (!employeesData?.data?.items || !Array.isArray(employeesData.data.items)) return [];

    return employeesData.data.items.map((employee: Employee) => ({
      value: employee.id,
      label: `${employee.firstName} ${employee.lastName}`,
    }));
  }, [employeesData]);

  const onSubmit = (data: PayrollSetupFormValues) => {
    return data;
    // console.log("Payroll Setup Form Submitted (raw):", data);
    setIsSubmittedAlertOpen(true);
  };

  return (
    <section>
      <h1 className="text-2xl font-bold">Payroll Setup</h1>
      <BreadCrumb items={[{ label: "Payroll", href: "/admin/payroll" }, { label: "Setup Payroll" }]} className="mb-6" />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="space-y-10">
            <section className="">
              <h2 className="mb-4 text-lg font-semibold">General payroll setup</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <FormField
                  name="frequency"
                  label="Payroll Frequency"
                  placeholder="Select payroll frequency"
                  type="select"
                  className="!h-14 w-full"
                  options={frequencyOptions}
                />
                <FormField
                  name="payday"
                  label="Payday"
                  placeholder="Select payday"
                  type="select"
                  className="!h-14 w-full"
                  options={paydayOptions}
                />
                <FormField
                  name="currency"
                  label="Currency"
                  placeholder="Select currency"
                  type="select"
                  className="!h-14 w-full"
                  options={currencyOptions}
                />
                <MultiSelect
                  name="approvers"
                  label="Approval for payroll disbursement"
                  placeholder="Select Employee(s)"
                  className="border-border bg-background !h-14 w-full border"
                  options={employeeOptions}
                  required
                />
              </div>
            </section>
            <section className="mt-8">
              <h2 className="mb-4 text-lg font-semibold">Company Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <FormField
                  name="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                  type="text"
                  className="!h-14 w-full"
                />
                <FormField
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter last name"
                  type="text"
                  className="!h-14 w-full"
                />
                <FormField
                  name="email"
                  label="Email"
                  placeholder="Enter email address"
                  type="email"
                  className="!h-14 w-full"
                />
                <FormField
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="Enter phone number"
                  type="text"
                  className="!h-14 w-full"
                />
              </div>
            </section>
            <section>
              <h2 className="mb-6 text-lg font-semibold">Global Bonuses & Deductions</h2>

              {/* Bonuses Section */}
              <div className="mb-8">
                <BonusDeductionManager
                  key={`bonuses-${(policyData?.data as CompanyPayrollPolicy | undefined)?.bonuses?.length ?? 0}`}
                  type="bonus"
                  initialItems={
                    (policyData?.data as CompanyPayrollPolicy | undefined)?.bonuses?.map((b: APIBonusDeduction) => ({
                      id: b.id ?? Math.random().toString(36).slice(2, 11),
                      name: b.name,
                      valueType: b.type === "percentage" ? "percentage" : "fixed",
                      value: Number(b.amount ?? b.value ?? 0),
                      status: b.status,
                      type: "bonus" as const,
                      createdAt: b.createdAt ? new Date(b.createdAt) : new Date(),
                      updatedAt: b.updatedAt ? new Date(b.updatedAt) : new Date(),
                    })) ?? []
                  }
                />
              </div>

              {/* Deductions Section */}
              <div>
                <BonusDeductionManager
                  key={`deductions-${(policyData?.data as CompanyPayrollPolicy | undefined)?.deductions?.length ?? 0}`}
                  type="deduction"
                  initialItems={
                    (policyData?.data as CompanyPayrollPolicy | undefined)?.deductions?.map((d: APIBonusDeduction) => ({
                      id: d.id ?? Math.random().toString(36).slice(2, 11),
                      name: d.name,
                      valueType: d.type === "percentage" ? "percentage" : "fixed",
                      value: Number(d.amount ?? d.value ?? 0),
                      status: d.status,
                      type: "deduction" as const,
                      createdAt: d.createdAt ? new Date(d.createdAt) : new Date(),
                      updatedAt: d.updatedAt ? new Date(d.updatedAt) : new Date(),
                    })) ?? []
                  }
                />
              </div>
            </section>
          </div>

          <div className="flex w-full items-center gap-4 pt-4">
            <MainButton type="button" variant="outline" className="w-50">
              Cancel
            </MainButton>
            <MainButton type="submit" variant="primary" className="w-50">
              Save & Continue
            </MainButton>
          </div>
        </form>
      </FormProvider>

      <AlertModal
        isOpen={isSubmittedAlertOpen}
        onClose={() => setIsSubmittedAlertOpen(false)}
        onConfirm={() => {
          setIsSubmittedAlertOpen(false);
          router.push("/admin/payroll");
        }}
        type="success"
        title="Payroll Setup Completed"
        description="Your payroll settings have been successfully configured. You can now review employee salary data, make necessary adjustments, and run payroll when it's time."
        confirmText="Continue to Payroll"
        showCancelButton={false}
        autoClose={false}
      />
    </section>
  );
};
