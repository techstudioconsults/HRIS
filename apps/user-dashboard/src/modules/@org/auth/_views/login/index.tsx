'use client';

import { LoginFormData, loginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormHeader } from '@workspace/ui/lib/form-header';
import { FormField } from '@workspace/ui/lib/inputs/FormFields';
import { MainButton } from '@workspace/ui/lib/button';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const Login = () => {
  const router = useRouter();
  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    setError,
  } = methods;

  const handleSubmitForm = async (data: LoginFormData) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      // Extract the actual error message from CredentialsSignin error
      let errorMessage = result.error;
      // Try to extract message after "CredentialsSignin: " prefix
      if (errorMessage.includes('CredentialsSignin: ')) {
        errorMessage = errorMessage.split('CredentialsSignin: ')[1];
      }
      // If it's the default NextAuth error, show the axios message
      if (errorMessage.includes('Read more at')) {
        errorMessage = errorMessage.split('.')[0];
      }

      toast.warning('Login Failed', {
        description: errorMessage,
      });
      setError('password', { message: errorMessage });
      return;
    }
    if (result?.ok) {
      toast.success('Login Successful', {
        description: 'Redirecting to dashboard...',
      });
      router.push('/login/continue');
    }
  };

  return (
    <section className="mx-auto w-full max-w-[527px]">
      <FormHeader
        title="Welcome Back, HR"
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
                  href="/forgot-password"
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
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
              Log In
            </MainButton>
          </div>
        </form>

        <section className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            {/*<GradientMask*/}
            {/*  direction={`left`}*/}
            {/*  className={`dark:from-[#121212] `}*/}
            {/*/>*/}
            {/*<GradientMask*/}
            {/*  direction={`right`}*/}
            {/*  className={`dark:from-[#121212]!`}*/}
            {/*/>*/}
            <hr className="w-full" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className=" rounded-full bg-background p-2">OR</span>
          </div>
        </section>

        <section>
          <MainButton
            href={`/login/otp`}
            variant="primaryOutline"
            className="w-full"
            size={`2xl`}
          >
            Log in with OTP instead
          </MainButton>
        </section>

        <section>
          <p className="text-grey-500 mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </section>
      </FormProvider>
    </section>
  );
};
