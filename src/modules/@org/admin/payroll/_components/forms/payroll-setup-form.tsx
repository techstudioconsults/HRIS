// import { zodResolver } from "@hookform/resolvers/zod";
"use client";

import { BreadCrumb } from "@/components/shared/breadcrumb";
import MainButton from "@/components/shared/button";
import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { FormField } from "@/components/shared/inputs/FormFields";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { BonusDeductionManager } from "../bonus-deduction-manager";

export const PayrollSetupForm = () => {
  const methods = useForm({
    // resolver: zodResolver(),
  });

  const router = useRouter();
  const [isSubmittedAlertOpen, setIsSubmittedAlertOpen] = useState(false);

  return (
    <section>
      <h1 className="text-2xl font-bold">Payroll Setup</h1>
      <BreadCrumb items={[{ label: "Payroll", href: "/admin/payroll" }, { label: "Setup Payroll" }]} className="mb-6" />
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setIsSubmittedAlertOpen(true);
          }}
        >
          <div className="space-y-10">
            <section className="">
              <h2 className="mb-4 text-lg font-semibold">General payroll setup</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <FormField
                  name="payroll_frequency"
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
                <FormField
                  name="employee_approval"
                  label="Approval for payroll disbursement"
                  placeholder="Select Employee"
                  type="select"
                  className="!h-14 w-full"
                />
              </div>
            </section>
            <section>
              <h2 className="mb-6 text-lg font-semibold">Global Bonuses & Deductions</h2>

              {/* Bonuses Section */}
              <div className="mb-8">
                <BonusDeductionManager type="bonus" />
              </div>

              {/* Deductions Section */}
              <div>
                <BonusDeductionManager type="deduction" />
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
