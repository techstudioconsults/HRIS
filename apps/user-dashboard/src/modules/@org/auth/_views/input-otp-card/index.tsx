/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PageSection } from "@/lib/animation";
import { LoginOTPFormData, loginOTPSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDecodedSearchParameters } from "@workspace/ui/hooks";
import { MainButton } from "@workspace/ui/lib/button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { OTPInput } from "../../_components/input-otp";
import { useAuthService } from "../../services/use-auth-service";

export const InputOtpCard = () => {
  const email = useDecodedSearchParameters("email");
  const router = useRouter();
  const { useRequestOTP } = useAuthService();
  const { mutateAsync: requestOTP, isPending: otpPending } = useRequestOTP();

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
    setError,
  } = methods;

  const handleSubmitForm = async (data: LoginOTPFormData) => {
    try {
      // Directly call signIn with the OTP provider
      const result = await signIn("otp", {
        email: data.email,
        otp: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        toast.success("Login Successful", {
          description: "Redirecting to dashboard...",
        });
        router.push("/onboarding");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login Failed", {
        description: error.message || "An error occurred during login",
      });
      setError("password", { message: error.message || "Invalid OTP" });
    }
  };

  const resendOTP = async () => {
    if (email) {
      await requestOTP(
        { email },
        {
          onError: (error) => {
            toast.error("Request Failed", {
              description: error instanceof Error ? error.message : "An unknown error occurred",
            });
          },
          onSuccess: (response) => {
            if (response?.success) {
              toast.success(`Request Sent Successfully`, {
                description: `Please check you mail for OTP`,
              });
            }
          },
        },
      );
    }
  };

  return (
    <PageSection index={0} className="bg-background mx-auto max-w-[589px] rounded-md p-8 shadow shadow-gray-100">
      <div className={`mb-8 space-y-2`}>
        <h3 className="text-[32px]/[120%] font-[600] tracking-[-2%] text-black">Enter the 6-digit Code</h3>
        <p className={`text-gray text-lg`}>
          A verification code has been sent to <span className={`font-bold`}>{email}</span>
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
              Didn&apos;t receive the code?{" "}
              <span onClick={resendOTP} className="text-primary cursor-pointer font-medium hover:underline">
                {otpPending ? "Sent" : "Resend"}
              </span>
            </p>
            <p className="text-grey-500 mt-4 text-center text-sm">
              Wrong email?{" "}
              <Link href="/login/otp" className="text-primary font-medium hover:underline">
                Change email
              </Link>
            </p>
          </div>
        </form>
      </FormProvider>
    </PageSection>
  );
};
