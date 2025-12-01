"use client";

import { PageSection, PageWrapper } from "@/lib/animation";
import { ForgotPasswordData, forgotPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, FormHeader } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAuthService } from "../../services/use-auth-service";

export const ForgotPassword = () => {
  const router = useRouter();
  const { useForgotPassword } = useAuthService();
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  const methods = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleSubmitForm = async (data: ForgotPasswordData) => {
    await forgotPassword(data, {
      onSuccess: (response) => {
        router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
        toast.success(`Request Successful`, {
          description: response?.data,
        });
      },
      onError: (error) => {
        toast.error("Request Failed", {
          description: error instanceof AxiosError ? error.response?.data.message : "An unknown error occurred",
        });
      },
    });
  };

  return (
    <PageWrapper>
      <PageSection index={0} className="bg-background mx-auto max-w-[589px] rounded-xl p-8 shadow">
        <div>
          <MainButton
            isIconOnly
            icon={<ArrowLeft />}
            size={`icon`}
            className={`hover:bg-primary mb-2 size-10 bg-gray-50 hover:text-white`}
            variant={`default`}
            onClick={() => {
              router.back();
            }}
          />
          <FormHeader title="Forgot Password" subTitle="Enter your email address to reset your password" />
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleSubmitForm)} className="">
            <section className={`space-y-4`}>
              <FormField
                placeholder={`Enter email address`}
                className={`h-14 w-full`}
                label={`Email Address`}
                name={"email"}
                type={`email`}
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
                Continue
              </MainButton>
            </div>
          </form>

          <p className="text-grey-500 mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </FormProvider>
      </PageSection>
    </PageWrapper>
  );
};
