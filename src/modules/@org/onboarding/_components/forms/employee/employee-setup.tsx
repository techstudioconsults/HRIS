/* eslint-disable no-console */
"use client";

import MainButton from "@/components/shared/button";
import { FormHeader } from "@/components/shared/form-header";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "iconsax-reactjs";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Employee, employeeSchema } from "../../../_views/step-three";
import { OnboardingService } from "../../../services/service";
import { EmployeeConfig } from "../../accordions/employee-config";

interface EmployeeSetupFormProperties {
  onBoardingService: OnboardingService;
}

export const EmployeeSetupForm = ({ onBoardingService }: EmployeeSetupFormProperties) => {
  const router = useRouter();
  const methods = useForm<{ employees: Employee[] }>({
    resolver: zodResolver(
      z.object({
        employees: z.array(employeeSchema),
      }),
    ),
    defaultValues: {
      employees: [
        {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "PleaseSetAdefaultHere1.",
          teamId: "",
          roleId: "",
        },
      ],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSubmitForm = async (data: { employees: Employee[] }) => {
    try {
      console.log("Submitting employees:", data);
      const response = await onBoardingService.onboardEmployees(data);
      if (response.success) {
        toast.success(`Registration Successful`, {
          description: `Employees registration completed, you can edit employee status in setting.`,
        });
        router.push(`/admin/dashboard`);
      }
    } catch (error) {
      console.error("Onboarding failed:", error);
      toast.error(`Registration Failed`, {
        description: `Form not filled properly..please try again`,
      });
    }
  };

  return (
    <section className="rounded-[10px] border p-7">
      <div className={`mb-8 space-y-2`}>
        <FormHeader icon={<User />} title="Onboard Employees" subTitle="Add your team members to get started" />
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            handleSubmit(handleSubmitForm)(event);
          }}
          className=""
        >
          <section className={`hide-scrollbar max-h-[500px] space-y-4 overflow-auto`}>
            <EmployeeConfig onBoardingService={onBoardingService} />
          </section>
          <div className="mt-4">
            <MainButton
              type="submit"
              variant="primary"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              className="w-full"
              size="xl"
            >
              Proceed to Dashboard
            </MainButton>
            <MainButton href={`/admin/dashboard`} type="button" variant="link" className="w-full font-medium" size="xl">
              Skip for Later
            </MainButton>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};
