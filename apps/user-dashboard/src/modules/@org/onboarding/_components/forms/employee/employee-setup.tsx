/* eslint-disable no-console */
"use client";

import { onboardEmployeeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormHeader } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { AxiosError } from "axios";
import { User } from "iconsax-reactjs";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Employee } from "../../../_views/step-three";
import { useOnboardingService } from "../../../services/use-onboarding-service";
import { EmployeeConfig } from "../../accordions/employee-config";

export const EmployeeSetupForm = () => {
  const router = useRouter();
  const { useOnboardEmployees } = useOnboardingService();
  const { mutateAsync: onboardEmployees, isPending: isOnboarding } = useOnboardEmployees();
  const methods = useForm<{ employees: Employee[] }>({
    resolver: zodResolver(
      z.object({
        employees: z.array(onboardEmployeeSchema),
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
      await onboardEmployees(data, {
        onSuccess: (response) => {
          if (response.success) {
            toast.success(`Registration Successful`, {
              description: `Employees registration completed, you can edit employee status in setting.`,
            });
            router.push(`/admin/dashboard`);
          }
        },
        onError: (error) => {
          console.error("Onboarding failed:", error);
          toast.error(`Registration Failed`, {
            description: error instanceof AxiosError ? error.response?.data?.message : "An unknown error occurred",
          });
        },
      });
    } catch (error) {
      console.error("Onboarding failed (unexpected):", error);
      toast.error(`Registration Failed`, {
        description: error instanceof AxiosError ? error.response?.data?.message : "An unknown error occurred",
      });
    }
  };

  return (
    <section className="rounded-[10px] border p-7" data-tour="employee-form">
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
          <section className={`space-y-4`}>
            <EmployeeConfig />
          </section>
          <div className="mt-4">
            <MainButton
              type="submit"
              variant="primary"
              isDisabled={isSubmitting || isOnboarding}
              isLoading={isSubmitting || isOnboarding}
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
