'use client';

import { LoginOTPFFormData, loginOTPFormSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField, FormHeader } from '@workspace/ui/lib';
import { MainButton } from '@workspace/ui/lib/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAuthService } from '../../services/use-auth-service';
import { GradientMask } from '@workspace/ui/lib/gradient-mask';

export const OTPLogin = () => {
  const router = useRouter();
  const { useRequestOTP } = useAuthService();
  const { mutateAsync: requestOTP, isPending } = useRequestOTP();
  const methods = useForm<LoginOTPFFormData>({
    resolver: zodResolver(loginOTPFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleSubmitForm = async (data: LoginOTPFFormData) => {
    await requestOTP(data, {
      onSuccess: (response) => {
        if (response?.success) {
          toast.success(`Request Sent Successfully`, {
            description: `Please check you mail for OTP`,
          });
          router.push(`/login/otp-verify?email=${data.email}`);
        }
      },
      onError: (error) => {
        toast.error('Registration Failed', {
          description: error.message,
        });
      },
    });
  };

  return (
    <section className="mx-auto w-full max-w-[527px]">
      <FormHeader
        title="Welcome Back, HR"
        subTitle=" Sign in with your work email to continue. We'll send a one-time passcode to your email to verify
          it's you."
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="">
          <section className={`space-y-4`}>
            <FormField
              type={`email`}
              placeholder={`Enter email address`}
              className={`h-14 w-full`}
              label={`Email Address`}
              name={'email'}
              required
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
              Send OTP
            </MainButton>
          </div>
        </form>

        <section className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <GradientMask direction={`left`} />
            <GradientMask direction={`right`} />
            <div className="w-full border border-primary/50" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="text-muted-foreground rounded-full bg-background p-2">
              OR
            </span>
          </div>
        </section>

        <div>
          <MainButton
            href={`/login`}
            type="button"
            variant="primaryOutline"
            className="w-full"
            size={`2xl`}
          >
            Log in with Password instead
          </MainButton>
          <p className="text-grey-500 mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </FormProvider>
    </section>
  );
};
