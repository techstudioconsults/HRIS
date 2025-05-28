/* eslint-disable no-console */
"use client";

import MainButton from "@/components/shared/button";
import { RegisterFormData, registerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { EmployeeConfig } from "../../accordions/employee-config";

export const EmployeeSetupForm = () => {
  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    // defaultValues: {
    //   full_name: "",
    //   email: "",
    //   password: "",
    //   password_confirmation: "",
    // },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    // watch,
  } = methods;

  const handleSubmitForm = async (data: RegisterFormData) => {
    console.log("Registering user with data:", data);
  };

  return (
    <section className="rounded-[10px] p-7 shadow-xl">
      <div className={`mb-8 space-y-2`}>
        <h3 className="text-2xl/[120%] font-[600] tracking-[-2%]">Onboard Employees</h3>
      </div>

      <FormProvider {...methods}>
        {/* <form onSubmit={handleSubmit(handleSubmitForm)} className=""> */}
        <section className={`hide-scrollbar max-h-[500px] space-y-4 overflow-auto`}>
          <EmployeeConfig />
        </section>
        <div className="mt-4">
          <MainButton
            type="submit"
            onClick={handleSubmit(handleSubmitForm)}
            variant="primary"
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            className="w-full"
            size="2xl"
          >
            Proceed to Dashbaord
          </MainButton>
          <MainButton
            variant="link"
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            className="w-full font-semibold"
            size="2xl"
          >
            Skip for Later
          </MainButton>
        </div>
        {/* </form> */}
      </FormProvider>
    </section>
  );
};
