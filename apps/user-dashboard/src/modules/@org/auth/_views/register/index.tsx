'use client';

import { RegisterFormData, registerSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormHeader } from '@workspace/ui/lib/form-header';
import { FormField } from '@workspace/ui/lib/inputs/FormFields';
import { MainButton } from '@workspace/ui/lib/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { useAuthService } from '../../services/use-auth-service';
import { getAuthErrorMessage } from '../../services/auth-errors';
import { routes } from '@/lib/routes/routes';
import { InfoTooltip } from '@workspace/ui/lib/tooltip';
import { toast } from 'sonner';

export const Register = () => {
  const router = useRouter();
  const { useSignUp } = useAuthService();
  const { mutateAsync: signUp, isPending } = useSignUp();
  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: '',
      domain: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit } = methods;

  // Live watch of password fields for immediate user feedback
  const passwordValue = methods.watch('password');
  const confirmPasswordValue = methods.watch('confirmPassword');
  const showPasswordStatus =
    typeof confirmPasswordValue === 'string' && confirmPasswordValue.length > 0; // Only show once user starts confirming
  const passwordsMatch =
    showPasswordStatus && passwordValue === confirmPasswordValue;

  const handleSubmitForm = async (data: RegisterFormData) => {
    await signUp(data, {
      onSuccess: () => {
        router.push(routes.auth.login());
      },
      onError: (error) => {
        toast.error(getAuthErrorMessage(error, 'register'));
      },
    });
  };

  return (
    <section className="mx-auto w-full max-w-131.75">
      <FormHeader
        title="Your HR, simplified and smarter."
        subTitle="Sign up to start managing everything HR, all in one place."
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="">
          <section className={`space-y-4`}>
            <FormField
              placeholder={`Enter company name`}
              className={`h-14 w-full`}
              label={`Company's Name`}
              name={'companyName'}
              required
            />
            <FormField
              placeholder={`Enter first name`}
              className={`h-14 w-full`}
              label={`First Name`}
              name={'firstName'}
              required
            />
            <FormField
              placeholder={`Enter last name`}
              className={`h-14 w-full`}
              label={`Last Name`}
              name={'lastName'}
              required
            />
            <div>
              <FormField
                placeholder={`Enter company domain e.g www.techstudiohr.com`}
                className={`h-14 w-full`}
                label={`Company Domain`}
                name={'domain'}
                required
              />
              <InfoTooltip
                className={`text-success`}
                content={
                  <span className={`text-xs`}>
                    Used to identify your organization and help verify employee
                    emails (e.g. www.techstudiohr.com).
                  </span>
                }
                side={'left'}
                iconSize={12}
              />
            </div>
            <FormField
              placeholder={`Enter email address`}
              className={`h-14 w-full`}
              label={`Work Email Address`}
              name={'email'}
              required
            />
            <FormField
              type={`password`}
              placeholder={`Enter password`}
              className={`h-14 w-full`}
              label={`Create Password`}
              name={'password'}
              required
            />
            <div className="space-y-1">
              <FormField
                type={`password`}
                placeholder={`Re-enter password`}
                className={`h-14 w-full`}
                label={`Confirm Password`}
                name={'confirmPassword'}
                required
              />
              {showPasswordStatus && (
                <p
                  className={`text-xs font-medium ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}
                  role="status"
                  aria-live="polite"
                >
                  {passwordsMatch
                    ? 'Passwords match.'
                    : 'Passwords do not match.'}
                </p>
              )}
            </div>
          </section>
          <div className="pt-8">
            <div className="text-muted-foreground mb-4 text-sm">
              <p>
                By signing up, you&apos;re agreeing to TechstudioHR&apos;s{' '}
                <Link
                  href="https://techstudiohr.com/privacy-policy"
                  className="text-primary hover:underline"
                  target={`_blank`}
                >
                  Privacy Policy
                </Link>
                , and{' '}
                <Link
                  href="https://techstudiohr.com/terms-of-use"
                  className="text-primary hover:underline"
                  target={`_blank`}
                >
                  Terms & Conditions.
                </Link>
              </p>
            </div>

            <MainButton
              type="submit"
              variant="primary"
              isDisabled={isPending}
              isLoading={isPending}
              className="w-full"
              size="2xl"
              data-testid="register-button"
            >
              Create Account
            </MainButton>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Have an account already?{' '}
            <Link
              href={routes.auth.login()}
              className="text-primary hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </FormProvider>
    </section>
  );
};
