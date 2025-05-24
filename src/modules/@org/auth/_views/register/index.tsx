/* eslint-disable no-console */
"use client";

import MainButton from "@/components/shared/button";
import { FormField } from "@/components/shared/FormFields";
import { Logo } from "@/components/shared/logo";
import { RegisterFormData, registerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Google } from "iconsax-reactjs";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";

// import { toast } from "sonner";

export const Register = () => {
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
    <section className="mx-auto min-h-screen max-w-[527px]">
      <div className={`mb-8 flex flex-col items-start`}>
        <div className="mb-16 flex justify-center">
          <Logo width={214} />
        </div>

        <div className={`space-y-2`}>
          <h3 className="text-[32px]/[120%] font-[600] tracking-[-2%] text-black">Your HR, simplified and smarter.</h3>
          <p className={`text-gray text-lg`}>Sign up to start managing everything HR, all in one place.</p>
        </div>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="">
          <section className={`space-y-4`}>
            <FormField
              placeholder={`Enter company name`}
              className={`h-14 w-full`}
              label={`Company's Name`}
              name={"full_name"}
            />
            <FormField
              placeholder={`Enter full name`}
              className={`h-14 w-full`}
              label={`Full Name`}
              name={"full_name"}
            />
            <FormField
              placeholder={`Enter email address`}
              className={`h-14 w-full`}
              label={`Email Address`}
              name={"email_address"}
            />
            <FormField
              type={`password`}
              placeholder={`Enter password`}
              className={`h-14 w-full`}
              label={`Create Password`}
              name={"password"}
            />

            <FormField
              type={`password`}
              placeholder={`Enter password`}
              className={`h-14 w-full`}
              label={`Confirm Password`}
              name={"password_confirmation"}
            />
          </section>
          <div className="pt-8">
            <div className="text-muted-foreground mb-4 text-sm">
              <p>
                By signing up, you’re agreeing to TechstudioHR’s{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                , and{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms & Conditions.
                </Link>
              </p>
            </div>

            <MainButton
              type="submit"
              variant="primary"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              className="w-full"
              size="2xl"
            >
              Create Account
            </MainButton>
          </div>
        </form>

        {/* <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="text-muted-foreground bg-white px-2">or continue with</span>
          </div>
        </div>

        <MainButton
          type="button"
          isLeftIconVisible
          icon={<Google />}
          size="2xl"
          variant="outline"
          className="w-full"
          // isDisabled={isGooglePending}
          // isLoading={isGooglePending}
          // onClick={handleGoogleSignIn}
        >
          Continue with Google
        </MainButton> */}

        <p className="mt-6 text-center text-sm text-gray-500">
          Have an account already?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Log In
          </Link>
        </p>
      </FormProvider>
    </section>
  );
};
