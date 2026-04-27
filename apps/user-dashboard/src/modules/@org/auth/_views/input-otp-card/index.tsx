'use client';

import { LoginOTPFormData, loginOTPSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDecodedSearchParameters } from '@workspace/ui/hooks';
import { MainButton } from '@workspace/ui/lib/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useSession } from '@/lib/session';
import { OTPInput } from '../../_components/input-otp';
import { useAuthService } from '../../services/use-auth-service';

export const InputOtpCard = () => {
  const email = useDecodedSearchParameters('email');
  const router = useRouter();
  const { refresh } = useSession();
  const { useRequestOTP, useLoginWithOTP } = useAuthService();
  const { mutateAsync: requestOTP, isPending: otpPending } = useRequestOTP();
  const { mutateAsync: loginWithOTP, isPending: loginPending } =
    useLoginWithOTP();

  const methods = useForm<LoginOTPFormData>({
    resolver: zodResolver(loginOTPSchema),
    defaultValues: {
      email: email || '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
    setValue,
    watch,
    setError,
  } = methods;

  const handleSubmitForm = async (data: LoginOTPFormData) => {
    try {
      const result = await loginWithOTP(data);
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

      toast.success('Login Successful', {
        description: 'Redirecting to dashboard...',
      });
      router.push('/login/continue');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid OTP';
      toast.error('Login Failed', { description: message });
      setError('password', { message });
    }
  };

  const resendOTP = async () => {
    if (email) {
      await requestOTP(
        { email },
        {
          onError: (error) => {
            toast.error('Request Failed', {
              description: error.message,
            });
          },
          onSuccess: (response) => {
            if (response?.success) {
              toast.success(`Request Sent Successfully`, {
                description: `Please check your mail for OTP`,
              });
            }
          },
        }
      );
    }
  };

  return (
    <section className="bg-background mx-auto w-full max-w-[589px] rounded-xl p-8 shadow">
      <div className={`mb-8 text-center lg:text-left space-y-2`}>
        <h3 className=" text-[24px] lg:text-[32px]/[120%] font-semibold tracking-[-2%] text-black">
          Enter the 6-digit Code
        </h3>
        <div className={`mt-6`}>
          <p className={``}> A verification code has been sent to </p>
          <p className={`font-bold truncate text-gray text-lg!`}>{email}</p>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <section>
            <OTPInput
              value={watch('password')}
              onChange={(value: string) =>
                setValue('password', value, { shouldValidate: true })
              }
            />
          </section>
          <div className={`mt-10`}>
            <MainButton
              type="submit"
              variant="primary"
              className="w-full"
              size="2xl"
              isDisabled={loginPending || !isValid}
              isLoading={loginPending}
              data-testid="otp-submit-button"
            >
              Login
            </MainButton>
            <p className="text-grey-500 mt-4 text-center text-sm">
              Did not receive the code?{' '}
              <span
                onClick={resendOTP}
                className="text-primary cursor-pointer font-medium hover:underline"
                data-testid="resend-otp-button"
              >
                {otpPending ? 'Sent' : 'Resend'}
              </span>
            </p>
            <p className="text-grey-500 mt-4 text-center text-sm">
              Wrong email?{' '}
              <Link
                href="/login/otp"
                className="text-primary font-medium hover:underline"
              >
                Change email
              </Link>
            </p>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};
