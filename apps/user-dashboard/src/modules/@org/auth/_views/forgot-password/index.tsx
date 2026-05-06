'use client';

import { useState } from 'react';
import { ForgotPasswordData, forgotPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { BackButton } from '@workspace/ui/lib/back-button';
import { FormHeader } from '@workspace/ui/lib/form-header';
import { FormField } from '@workspace/ui/lib/inputs/FormFields';
import { MainButton } from '@workspace/ui/lib/button';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';

import { useAuthService } from '../../services/use-auth-service';
import { getAuthErrorMessage } from '../../services/auth-errors';
import { AlertModal } from '@workspace/ui/lib/dialog';
import { routes } from '@/lib/routes/routes';
import { Card } from '@workspace/ui/components/card';
import { FieldValidFeedback } from '../../_components/field-valid-feedback';

export const ForgotPassword = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { useForgotPassword } = useAuthService();
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  const methods = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isValid },
  } = methods;

  const handleSubmitForm = async (data: ForgotPasswordData) => {
    await forgotPassword(data, {
      onSuccess: () => {
        setShowSuccessModal(true);
      },
      onError: (error) => {
        setError('email', {
          message: getAuthErrorMessage(error, 'forgot-password'),
        });
      },
    });
  };

  return (
    <Card className="mx-auto max-w-[589px] w-full rounded-xl p-8 shadow">
      <div className={`space-y-4`}>
        <BackButton size={32} />
        <FormHeader
          title="Forgot Password"
          subTitle="Enter your email address to reset your password"
        />
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="">
          <section className={`space-y-4`}>
            <FormField
              placeholder={`Enter email address`}
              className={`h-14 w-full`}
              label={`Email Address`}
              name={'email'}
              type={`email`}
            />
            <FieldValidFeedback name="email" />
          </section>
          <div className="pt-8">
            <MainButton
              type="submit"
              variant="primary"
              isDisabled={isPending || !isValid}
              isLoading={isPending}
              className="w-full"
              size="2xl"
              data-testid="forgot-password-button"
            >
              Continue
            </MainButton>
          </div>
        </form>

        <p className="text-grey-500 mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link
            href={routes.auth.register()}
            className="text-primary hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </FormProvider>

      <AlertModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onConfirm={() => setShowSuccessModal(false)}
        type="success"
        title="Check Your Email"
        description="We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password."
        confirmText="Got It"
        showCancelButton={false}
      />
    </Card>
  );
};
