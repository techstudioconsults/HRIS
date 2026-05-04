'use client';

import { useSearchParameters } from '@workspace/ui/hooks';
import { ResetPasswordData, resetPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';

import { useAuthService } from '../../services/use-auth-service';
import { getAuthErrorMessage } from '../../services/auth-errors';
import { toast } from 'sonner';
import { FormField } from '@workspace/ui/lib/inputs/FormFields';
import { Card } from '@workspace/ui/components/card';

export const ResetPassword = () => {
  const token = useSearchParameters('token');
  const router = useRouter();
  const { useResetPassword } = useAuthService();
  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  const methods = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleSubmitForm = async (data: ResetPasswordData) => {
    const tokenizedData: {
      token?: string;
      password: string;
      confirmPassword: string;
    } = {
      ...data,
      ...(token ? { token } : {}),
    };

    await resetPassword(tokenizedData, {
      onSuccess: () => {
        router.push(`/login`);
      },
      onError: (error) => {
        toast.error(getAuthErrorMessage(error, 'reset-password'));
      },
    });
  };

  return (
    <Card className="mx-auto max-w-[589px] w-full rounded-xl p-8 shadow">
      <div className={`mb-8 space-y-2`}>
        <h3 className="text-[32px]/[120%] font-semibold tracking-[-2%]">
          Reset Password
        </h3>
        <p className={`text-gray`}>
          Enter your new password to reset your password
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="">
          <section className={`space-y-4`}>
            <FormField
              type={`password`}
              placeholder={`Enter password`}
              className={`h-14 w-full`}
              label={`New Password`}
              name={'password'}
            />
            <FormField
              type={`password`}
              placeholder={`Enter password`}
              className={`h-14 w-full`}
              label={`Confirm Password`}
              name={'confirmPassword'}
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
              data-testid="reset-password-button"
            >
              Reset password
            </MainButton>
          </div>
        </form>

        <span className={`flex items-center justify-center`}>
          <Link
            href="/register"
            className="text-grey-500 font-medium hover:underline text-primary w-fit mt-4
          flex items-center justify-center gap-2 text-sm"
          >
            <Icon name="ArrowLeft2" size={24} />
            Back to Sign In
          </Link>
        </span>
      </FormProvider>
    </Card>
  );
};
