"use client";

import { PageSection, PageWrapper } from "@/lib/animation";
import { LoginOTPFFormData, loginOTPFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, FormHeader } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAuthService } from "../../services/use-auth-service";

export const OTPLogin = () => {
  const router = useRouter();
  const { useRequestOTP } = useAuthService();
  const { mutateAsync: requestOTP, isPending } = useRequestOTP();
  const methods = useForm<LoginOTPFFormData>({
    resolver: zodResolver(loginOTPFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleSubmitForm = async (data: LoginOTPFFormData) => {
    await requestOTP(data, {
      onSuccess: (response) => {
        if (response?.success) {
          toast.success(`Request Sent Successfully`, {
            description: `Please check you mail for OTP`,
          });
          router.push(`/login/otp-verify?email=${data.email}`);
        }
      },
      onError: (error) => {
        toast.error("Registration Failed", {
          description: error instanceof Error ? error.message : "An unknown error occurred",
        });
      },
    });
  };

  return (
    <PageWrapper className="mx-auto max-w-[527px]">
      <PageSection index={0}>
        <FormHeader
          title="Welcome Back, HR"
          subTitle=" Sign in with your work email to continue. We'll send a one-time passcode to your email to verify
          it's you."
        />
      </PageSection>

      <FormProvider {...methods}>
        <PageSection index={1}>
          <form onSubmit={handleSubmit(handleSubmitForm)} className="">
            <section className={`space-y-4`}>
              <FormField
                type={`email`}
                placeholder={`Enter email address`}
                className={`h-14 w-full`}
                label={`Email Address`}
                name={"email"}
                required
              />
            </section>
            <div className="pt-8">
              <MainButton
                type="submit"
                variant="primary"
                isDisabled={isPending || !isValid}
                isLoading={isPending}
                className="w-full"
                size="2xl"
              >
                Send OTP
              </MainButton>
            </div>
          </form>
        </PageSection>

        <PageSection index={2} className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="text-muted-foreground bg-background px-2">OR</span>
          </div>
        </PageSection>

        <PageSection index={3}>
          <MainButton href={`/login`} type="button" variant="primaryOutline" className="w-full" size={`2xl`}>
            Log in with Password instead
          </MainButton>
          <p className="text-grey-500 mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </PageSection>
      </FormProvider>
    </PageWrapper>
  );
};
