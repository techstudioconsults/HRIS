'use client';

import { LoginFormData, loginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormHeader } from '@workspace/ui/lib/form-header';
import { FormField } from '@workspace/ui/lib/inputs/FormFields';
import { MainButton } from '@workspace/ui/lib/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { useSession } from '@/lib/session';
import { useAuthService } from '../../services/use-auth-service';
import { getAuthErrorMessage } from '../../services/auth-errors';
import { routes } from '@/lib/routes/routes';

export const Login = () => {
  const router = useRouter();
  const { refresh } = useSession();
  const { useLoginWithPassword } = useAuthService();
  const { mutateAsync: loginWithPassword, isPending } = useLoginWithPassword();

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit, setError } = methods;

  const handleSubmitForm = async (data: LoginFormData) => {
    try {
      const result = await loginWithPassword(data);
      if (!result?.data) throw new Error('Unexpected response from server');

      const sessionRes = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee: result.data.employee,
          tokens: result.data.tokens,
          permissions: result.data.permissions,
        }),
      });

      if (!sessionRes.ok) throw new Error('Failed to establish session');

      await refresh();
      router.push(routes.auth.loginContinue());
    } catch (error) {
      setError('password', { message: getAuthErrorMessage(error, 'login') });
    }
  };

  return (
    <section className="mx-auto w-full max-w-131.75">
      <FormHeader
        title="Welcome Back"
        subTitle="Login to access your HR dashboard, and simplify operations."
      />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="">
          <section className={`space-y-4`}>
            <FormField
              placeholder={`Enter email address`}
              className={`h-14 w-full`}
              label={`Email Address`}
              name={'email'}
              required
            />
            <div className="space-y-2">
              <FormField
                type={`password`}
                placeholder={`Enter password`}
                className={`h-14 w-full`}
                label={`Password`}
                name={'password'}
                required
              />
              <div className="flex justify-end">
                <Link
                  href={routes.auth.forgotPassword()}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
          </section>
          <div className="pt-8">
            <MainButton
              data-testid={`login-button`}
              type="submit"
              variant="primary"
              isDisabled={isPending}
              isLoading={isPending}
              className="w-full"
              size="2xl"
            >
              Log In
            </MainButton>
          </div>
        </form>

        <section className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <hr className="w-full" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className=" rounded-full bg-background p-2">OR</span>
          </div>
        </section>

        <section>
          <MainButton
            href={routes.auth.loginOtp()}
            variant="outline"
            className="w-full"
            size={`2xl`}
          >
            Log in with OTP instead
          </MainButton>
        </section>

        <section>
          <p className="text-grey-500 mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link
              href={routes.auth.register()}
              className="text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </section>
      </FormProvider>
    </section>
  );
};
