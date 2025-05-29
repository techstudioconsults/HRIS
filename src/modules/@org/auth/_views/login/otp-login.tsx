/* eslint-disable no-console */
"use client";

import MainButton from "@/components/shared/button";
import { FormField } from "@/components/shared/FormFields";
import { RegisterFormData, registerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";

// import { toast } from "sonner";

export const OTPLogin = () => {
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
    <section className="mx-auto max-w-[527px]">
      <div className={`mb-8 space-y-2`}>
        <h3 className="text-[32px]/[120%] font-[600] tracking-[-2%] text-black">Welcome Back, HR</h3>
        <p className={`text-gray text-lg`}>
          Sign in with your work email to continue. We&apos;ll send a one-time passcode to your email to verify
          it&apos;s you.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="">
          <section className={`space-y-4`}>
            <FormField
              placeholder={`Enter email address`}
              className={`h-14 w-full`}
              label={`Email Address`}
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
              Send OTP
            </MainButton>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="text-muted-foreground bg-white px-2">OR</span>
          </div>
        </div>

        <MainButton href={`/login`} type="button" variant="outline" className="w-full" size={`2xl`}>
          Log in with Password instead
        </MainButton>

        <p className="text-grey-500 mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </FormProvider>
    </section>
  );
};
