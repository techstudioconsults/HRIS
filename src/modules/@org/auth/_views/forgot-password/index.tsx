"use client";

import MainButton from "@/components/shared/button";
import { FormField } from "@/components/shared/FormFields";
import { WithDependency } from "@/HOC/withDependencies";
import { dependencies } from "@/lib/tools/dependencies";
import { ForgotPasswordData, forgotPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "iconsax-reactjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthService } from "../../services/auth.service";

// import { toast } from "sonner";

export const BaseForgotPassword = ({ authService }: { authService: AuthService }) => {
  const router = useRouter();
  const methods = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    // watch,
  } = methods;

  const handleSubmitForm = async (data: ForgotPasswordData) => {
    const response = await authService.forgotPassword(data);

    if (response?.success) {
      toast.success(`Message Sent`, {
        description: response.data,
      });
      router.push(`/reset-password`);
    }
  };

  return (
    <section className="mx-auto max-w-[589px] rounded-xl bg-white p-8 shadow-2xl shadow-gray-100">
      <div className={`mb-8 space-y-2`}>
        <MainButton
          isIconOnly
          icon={<ArrowLeft />}
          size={`icon`}
          className={`size-10 bg-gray-50`}
          variant={`default`}
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
              isDisabled={isSubmitting || !isValid}
              isLoading={isSubmitting}
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

export const ForgotPassword = WithDependency(BaseForgotPassword, {
  authService: dependencies.AUTH_SERVICE,
});
