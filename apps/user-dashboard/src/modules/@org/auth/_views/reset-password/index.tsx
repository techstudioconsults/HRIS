"use client";

import { useSearchParameters } from "@workspace/ui/hooks";
import { ResetPasswordData, resetPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { MainButton } from "@workspace/ui/lib/button";
import { AxiosError } from "axios";
import { ArrowLeft } from "iconsax-reactjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAuthService } from "../../services/use-auth-service";
import { FormField } from "@workspace/ui/lib";

export const ResetPassword = () => {
  const token = useSearchParameters("token");
  const router = useRouter();
  const { useResetPassword } = useAuthService();
  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  const methods = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleSubmitForm = async (data: ResetPasswordData) => {
    const tokenizedData: {
      token?: string;
      password: string;
      confirmPassword: string;
    } = {
      ...data,
      ...(token ? { token } : {}),
    };

    await resetPassword(tokenizedData, {
      onSuccess: (response) => {
        toast.success(`Password Reset Successful`, {
          description: response?.data,
        });
        router.push(`/login`);
      },
      onError: (error) => {
        toast.error("Password Reset Failed", {
          description: error instanceof AxiosError ? error.response?.data.message : "An unknown error occurred",
        });
      },
    });
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
              name={"password"}
            />
            <FormField
              type={`password`}
              placeholder={`Enter password`}
              className={`h-14 w-full`}
              label={`Confirm Password`}
              name={"confirmPassword"}
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
              Reset password
            </MainButton>
          </div>
        </form>

        <span className="text-grey-500 text-primary mt-4 flex items-center justify-center gap-2 text-center text-sm">
          <ArrowLeft />
          <Link href="/register" className="font-medium hover:underline">
            Back to Sign In
          </Link>
        </span>
      </FormProvider>
    </section>
  );
};
