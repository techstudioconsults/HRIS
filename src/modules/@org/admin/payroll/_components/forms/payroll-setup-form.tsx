// import { zodResolver } from "@hookform/resolvers/zod";
"use client";

import { BreadCrumb } from "@/components/shared/breadcrumb";
import MainButton from "@/components/shared/button";
import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { FormField, MultiSelect } from "@/components/shared/inputs/FormFields";
import { useEmployeeService } from "@/modules/@org/admin/employee/services/use-service";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { usePayrollService } from "../../services/use-service";
import type { BonusDeduction, CompanyPayrollPolicy } from "../../types";
import { BonusDeductionManager } from "../bonus-deduction-manager";

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
  });

  const router = useRouter();
  const [isSubmittedAlertOpen, setIsSubmittedAlertOpen] = useState(false);
  const [bonusItems, setBonusItems] = useState<BonusDeduction[]>([]);
  const [deductionItems, setDeductionItems] = useState<BonusDeduction[]>([]);

  // Fetch employees for approval dropdown
  const { useGetAllEmployees } = useEmployeeService();
  const { data: employeesData } = useGetAllEmployees(
    {},
    {
      staleTime: 0,
      refetchOnMount: true,
    },
  );

  // Fetch company payroll policy
  const { useGetCompanyPayrollPolicy } = usePayrollService();
  const { data: policyData } = useGetCompanyPayrollPolicy({
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // Populate form with existing policy data
  useEffect(() => {
    if (policyData?.data) {
      const policy = policyData.data as CompanyPayrollPolicy;

      methods.reset({
        payday: policy.payday?.toString() || "0",
        frequency: policy.frequency || "",
        currency: policy.currency || "",
        approvers: policy.approvers || [],
        firstName: policy.firstName || "",
        lastName: policy.lastName || "",
        email: policy.email || "",
        phoneNumber: policy.phoneNumber || "",
      });

      // Set bonuses and deductions
      if (policy.bonuses && policy.bonuses.length > 0) {
        const formattedBonuses: BonusDeduction[] = policy.bonuses.map((bonus) => ({
          id: bonus.id,
          name: bonus.name,
          value: bonus.amount,
          valueType: bonus.type,
          status: bonus.status,
          type: "bonus" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        setBonusItems(formattedBonuses);
      }

      if (policy.deductions && policy.deductions.length > 0) {
        const formattedDeductions: BonusDeduction[] = policy.deductions.map((deduction) => ({
          id: deduction.id,
          name: deduction.name,
          value: deduction.amount,
          valueType: deduction.type,
          status: deduction.status,
          type: "deduction" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        setDeductionItems(formattedDeductions);
      }
    }
  }, [policyData, methods]);

  // Transform employees to select options
  const employeeOptions = useMemo(() => {
    if (!employeesData?.data?.items || !Array.isArray(employeesData.data.items)) return [];

    return employeesData.data.items.map((employee: Employee) => ({
      value: employee.id,
      label: `${employee.firstName} ${employee.lastName}`,
    }));
  }, [employeesData]);

  const onSubmit = (data: PayrollSetupFormValues) => {
    // Log submitted data for debugging/inspection
    // You can replace this with an API call later
    /* eslint-disable no-console */
    console.log("Payroll Setup Form Submitted (raw):", data);

    const payload = {
      // Mimic desired request shape
      success: true,
      data: {
        // id and companyId would typically be set server-side or from context
        // id: undefined,
        // companyId: undefined,
        payday: Number.isNaN(Number(data.payday)) ? 0 : Number(data.payday),
        frequency: data.frequency,
        currency: data.currency,
        bonuses: bonusItems.map((item) => ({
          id: item.id,
          name: item.name,
          amount: item.value,
          type: item.valueType,
          status: item.status,
        })),
        deductions: deductionItems.map((item) => ({
          id: item.id,
          name: item.name,
          amount: item.value,
          type: item.valueType,
          status: item.status,
        })),
        approvers: data.approvers,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        // createdAt can be set by the server; included here if needed
        // createdAt: new Date().toISOString(),
      },
    };

    console.log("Payroll Setup Payload:", payload);
    console.table(payload.data.bonuses);
    console.table(payload.data.deductions);
    /* eslint-enable no-console */
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
                />
                <FormField
                  name="payday"
                  label="Payday"
                  placeholder="Select payday"
                  type="select"
                  className="!h-14 w-full"
                />
                <FormField
                  name="currency"
                  label="Currency"
                  placeholder="Select currency"
                  type="select"
                  className="!h-14 w-full"
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
                <BonusDeductionManager type="bonus" onChange={setBonusItems} />
              </div>

              {/* Deductions Section */}
              <div>
                <BonusDeductionManager type="deduction" onChange={setDeductionItems} />
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
