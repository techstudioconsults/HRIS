"use client";

import MainButton from "@/components/shared/button";
import { FormField } from "@/components/shared/inputs/FormFields";
import { ForgotPasswordData, forgotPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
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
    try {
      const response = await forgotPassword(data);
      toast.success(`Registration Successful`, {
        description: response?.data,
      });
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      toast.error("Registration Failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <section className="mx-auto max-w-[589px] rounded-xl bg-white p-8 shadow-2xl shadow-gray-100">
      <div className={`mb-8 space-y-2`}>
        <MainButton
          isIconOnly
          icon={<ArrowLeft />}
          size={`icon`}
          className={`hover:bg-primary size-10 bg-gray-50 hover:text-white`}
          variant={`default`}
          onClick={() => {
            router.back();
          }}
        />
        <h3 className="text-[32px]/[120%] font-[600] tracking-[-2%] text-black">Forgot Password</h3>
        <p className={`text-gray text-lg`}>Enter your email address to reset your password</p>
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
    </section>
  );
};
