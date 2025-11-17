"use client";

import MainButton from "@/components/shared/button";
import { FormField } from "@/components/shared/inputs/FormFields";
import { RegisterFormData, registerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
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

  const handleSubmitForm = async (data: RegisterFormData) => {
    try {
      const response = await signUp(data);
      if (response?.success) {
        toast.success(`Registration Successful`, {
          description: `Registration Successful`,
        });
        router.push(`/login`);
      }
    } catch (error) {
      toast.error("Registration Failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <section className="mx-auto max-w-[527px]">
      <div className={`mb-8 space-y-2`}>
        <h3 className="text-[32px]/[120%] font-[600] tracking-[-2%] text-black">Your HR, simplified and smarter.</h3>
        <p className={`text-gray text-lg`}>Sign up to start managing everything HR, all in one place.</p>
      </div>

      <FormProvider {...methods}>
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
            <FormField
              type={`password`}
              placeholder={`Enter password`}
              className={`h-14 w-full`}
              label={`Confirm Password`}
              name={"confirmPassword"}
              required
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
              isDisabled={isPending || !isValid}
              isLoading={isPending}
              className="w-full"
              size="2xl"
            >
              Create Account
            </MainButton>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Have an account already?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Log In
          </Link>
        </p>
      </FormProvider>
    </section>
  );
};
