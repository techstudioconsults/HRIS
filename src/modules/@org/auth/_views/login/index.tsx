"use client";

import MainButton from "@/components/shared/button";
import { FormField } from "@/components/shared/FormFields";
import { login } from "@/modules/@org/auth/lib/next-auth/auth-action";
import { LoginFormData, loginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";

// import { toast } from "sonner";

export const Login = () => {
  // const { data: session } = useSession();
  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const handleSubmitForm = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <section className="mx-auto max-w-[527px]">
      <div className={`mb-8 space-y-2`}>
        <h3 className="text-[32px]/[120%] font-[600] tracking-[-2%] text-black">Welcome Back, HR</h3>
        <p className={`text-gray text-lg`}>Login to access your HR dashboard, and simplify operations.</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="">
          <section className={`space-y-4`}>
            <FormField
              placeholder={`Enter email address`}
              className={`h-14 w-full`}
              label={`Email Address`}
              name={"email"}
            />
            <div className="space-y-2">
              <FormField
                type={`password`}
                placeholder={`Enter password`}
                className={`h-14 w-full`}
                label={`Password`}
                name={"password"}
              />
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-primary font-medium hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>
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
              Log In
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

        <MainButton href={`/login?type=otp`} variant="outline" className="w-full" size={`2xl`} isDisabled={isValid}>
          Log in with OTP instead
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
