"use client";

import { PageSection, PageWrapper } from "@/lib/animation";
import { RegisterFormData, registerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, FormHeader } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { AxiosError } from "axios";
import { Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAuthService } from "../../services/use-auth-service";

export const Register = () => {
  const router = useRouter();
  const { useSignUp } = useAuthService();
  const { mutateAsync: signUp, isPending } = useSignUp();
  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: "",
      domain: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  // Live watch of password fields for immediate user feedback
  const passwordValue = methods.watch("password");
  const confirmPasswordValue = methods.watch("confirmPassword");
  const showPasswordStatus = typeof confirmPasswordValue === "string" && confirmPasswordValue.length > 0; // Only show once user starts confirming
  const passwordsMatch = showPasswordStatus && passwordValue === confirmPasswordValue;

  const handleSubmitForm = async (data: RegisterFormData) => {
    await signUp(data, {
      onSuccess: () => {
        toast.success(`Registration Successful`, {
          description: `Registration Successful`,
        });
        router.push(`/login`);
      },
      onError: (error) => {
        toast.warning("Registration Failed", {
          description: error instanceof AxiosError ? error?.response?.data.message : "An unknown error occurred",
        });
      },
    });
  };

  return (
    <PageWrapper className="mx-auto max-w-[527px]">
      <PageSection index={0}>
        <FormHeader
          title="Your HR, simplified and smarter."
          subTitle="Sign up to start managing everything HR, all in one place."
        />
      </PageSection>

      <FormProvider {...methods}>
        <PageSection index={1}>
          <form onSubmit={handleSubmit(handleSubmitForm)} className="">
            <section className={`space-y-4`}>
              <FormField
                placeholder={`Enter company name`}
                className={`h-14 w-full`}
                label={`Company's Name`}
                name={"companyName"}
                required
              />
              <FormField
                placeholder={`Enter first name`}
                className={`h-14 w-full`}
                label={`First Name`}
                name={"firstName"}
                required
              />
              <FormField
                placeholder={`Enter last name`}
                className={`h-14 w-full`}
                label={`Last Name`}
                name={"lastName"}
                required
              />
              <div>
                <FormField
                  placeholder={`Enter company domain e.g https://www.techstudioacademy.com`}
                  className={`h-14 w-full`}
                  label={`Company Domain`}
                  name={"domain"}
                  required
                />
                <p className={`text-primary-200 flex items-start text-[11.5px] italic`}>
                  <Info size={14} className="mt-1 mr-1 inline" /> Used to identify your organization and help verify
                  employee emails (e.g., @techstudio.com).
                </p>
              </div>
              <FormField
                placeholder={`Enter email address`}
                className={`h-14 w-full`}
                label={`Work Email Address`}
                name={"email"}
                required
              />
              <FormField
                type={`password`}
                placeholder={`Enter password`}
                className={`h-14 w-full`}
                label={`Create Password`}
                name={"password"}
                required
              />
              <div className="space-y-1">
                <FormField
                  type={`password`}
                  placeholder={`Re-enter password`}
                  className={`h-14 w-full`}
                  label={`Confirm Password`}
                  name={"confirmPassword"}
                  required
                />
                {showPasswordStatus && (
                  <p
                    className={`text-xs font-medium ${passwordsMatch ? "text-green-600" : "text-red-600"}`}
                    role="status"
                    aria-live="polite"
                  >
                    {passwordsMatch ? "Passwords match." : "Passwords do not match."}
                  </p>
                )}
              </div>
            </section>
            <div className="pt-8">
              <div className="text-muted-foreground mb-4 text-sm">
                <p>
                  By signing up, you&apos;re agreeing to TechstudioHR&apos;s{" "}
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
                isDisabled={isPending || !isValid}
                isLoading={isPending}
                className="w-full"
                size="2xl"
              >
                Create Account
              </MainButton>
            </div>
          </form>
        </PageSection>

        <PageSection index={2} className="mt-6 text-center text-sm text-gray-500">
          <p>
            Have an account already?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log In
            </Link>
          </p>
        </PageSection>
      </FormProvider>
    </PageWrapper>
  );
};
