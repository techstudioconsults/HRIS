"use client";

import MainButton from "@/components/shared/button";
import { useSearchParameters } from "@/hooks/use-search-parameters";
import { LoginOTPFormData, loginOTPSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { OTPInput } from "../../_components/input-otp";
import { OTPLogin } from "../../actions/auth-action";

export const InputOtpCard = () => {
  const email = useSearchParameters("email");

  const methods = useForm<LoginOTPFormData>({
    resolver: zodResolver(loginOTPSchema),
    defaultValues: {
      email: email || "",
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    setValue,
    watch,
  } = methods;

  const handleSubmitForm = async (data: LoginOTPFormData) => {
    const result = await OTPLogin(data);

    if (result?.error) {
      toast.error("Login Failed", {
        description: result.error,
      });
    } else if (result?.success) {
      toast.success(`Login Successful`, {
        description: `Redirecting to onboarding...`,
      });
      // window.location.href = "/onboarding";
    }
  };

  return (
    <section className="mx-auto max-w-[589px] rounded-xl bg-white p-8 shadow-2xl shadow-gray-100">
      <div className={`mb-8 space-y-2`}>
        <h3 className="text-[32px]/[120%] font-[600] tracking-[-2%] text-black">Enter the 6-digit Code</h3>
        <p className={`text-gray text-lg`}>
          A verification code has been sent to <span className={`font-bold`}>“{email}”</span>
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <section>
            <OTPInput
              value={watch("password")}
              onChange={(value: string) => setValue("password", value, { shouldValidate: true })}
            />
          </section>
          <div className={`mt-10`}>
            <MainButton
              type="submit"
              variant="primary"
              className="w-full"
              size="2xl"
              isDisabled={isSubmitting || !isValid}
              isLoading={isSubmitting}
            >
              Login
            </MainButton>
            <p className="text-grey-500 mt-4 text-center text-sm">
              Didnt receive the code?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Resend
              </Link>
            </p>
            <p className="text-grey-500 mt-4 text-center text-sm">
              Wrong email?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Change email
              </Link>
            </p>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};
