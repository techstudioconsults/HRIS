/* eslint-disable no-console */
"use client";

import MainButton from "@/components/shared/button";
import { FormField } from "@/components/shared/FormFields";
import { RegisterFormData, registerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "iconsax-reactjs";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";

// import { toast } from "sonner";

export const ResetPassword = () => {
  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
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
    <section className="mx-auto max-w-[589px] rounded-xl bg-white p-8 shadow-2xl shadow-gray-100">
      <div className={`mb-8 space-y-2`}>
        <h3 className="text-[32px]/[120%] font-[600] tracking-[-2%] text-black">Reset Password</h3>
        <p className={`text-gray text-lg`}>Enter your new password to reset your password</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="">
          <section className={`space-y-4`}>
            <FormField
              type={`password`}
              placeholder={`Enter password`}
              className={`h-14 w-full`}
              label={`New Password`}
              name={"email_address"}
            />
            <FormField
              type={`password`}
              placeholder={`Enter password`}
              className={`h-14 w-full`}
              label={`Confirm Password`}
              name={"email_address"}
            />
          </section>
          <div className="pt-8">
            <MainButton
              type="submit"
              variant="primary"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              className="w-full"
              size="2xl"
            >
              Reset password
            </MainButton>
          </div>
        </form>

        <span className="text-grey-500 mt-4 flex items-center justify-center gap-2 text-center text-sm">
          <ArrowLeft />
          <Link href="/register" className="text-primary font-medium hover:underline">
            Back to Sign In
          </Link>
        </span>
      </FormProvider>
    </section>
  );
};
