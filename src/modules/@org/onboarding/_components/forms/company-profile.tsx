/* eslint-disable no-console */
"use client";

import MainButton from "@/components/shared/button";
import { FormField } from "@/components/shared/FormFields";
import { RegisterFormData, registerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

// import { toast } from "sonner";

export const CompanyProfile = () => {
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
        <h3 className="text-2xl/[120%] font-[600] tracking-[-2%]">Set up your company profile</h3>
      </div>

      <FormProvider {...methods}>
        {/* <form onSubmit={handleSubmit(handleSubmitForm)} className=""> */}
        <section className={`hide-scrollbar max-h-[500px] space-y-4 overflow-auto`}>
          <FormField
            placeholder={`Enter company name`}
            className={`h-14 w-full`}
            label={`Company's Name`}
            name={"full_name"}
          />
          <FormField
            type={`select`}
            placeholder={`Select industry`}
            className={`!h-14 w-full`}
            label={`Industry`}
            name={"industry"}
          />
          <FormField
            type={`select`}
            placeholder={`Select size`}
            className={`!h-14 w-full`}
            label={`Company Size`}
            name={"industry"}
          />
          <FormField
            placeholder={`Enter company's location`}
            className={`h-14 w-full`}
            label={`Address Line 1`}
            name={"address_line_1"}
          />
          <FormField
            placeholder={`Enter company's location`}
            className={`h-14 w-full`}
            label={`Address Line 2`}
            name={"address_line_2"}
          />
          <FormField
            type={`select`}
            placeholder={`Select country`}
            className={`!h-14 w-full`}
            label={`Country`}
            name={"country"}
          />
          <FormField
            type={`select`}
            placeholder={`Select state`}
            className={`!h-14 w-full`}
            label={`State`}
            name={"state"}
          />
          <FormField
            type={`select`}
            placeholder={`Select city`}
            className={`!h-14 w-full`}
            label={`City`}
            name={"city"}
          />
          <FormField
            placeholder={`Enter postal code`}
            className={`!h-14 w-full`}
            label={`Post Code`}
            name={"post code"}
          />
        </section>
        <div className="pt-8">
          <MainButton
            type="submit"
            onClick={handleSubmit(handleSubmitForm)}
            variant="primary"
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            className="w-full"
            size="2xl"
          >
            Continue
          </MainButton>
        </div>
        {/* </form> */}
      </FormProvider>
    </section>
  );
};
