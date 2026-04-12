import { MainButton } from '@workspace/ui/lib/button';
import Link from 'next/link';
import { Card } from '@workspace/ui/components/card';

export const CheckMailCard = () => {
  return (
    <Card className="mx-auto max-w-[589px] w-full rounded-xl bg-background p-8 shadow">
      <div className={`mb-8 space-y-2`}>
        <h3 className="text-[32px]/[120%] font-semibold tracking-[-2%]">
          Forgot Password
        </h3>
        <p className={`text-gray text-lg`}>
          Enter your email address to reset your password
        </p>
      </div>
      <MainButton type="submit" variant="primary" className="w-full" size="2xl">
        Continue
      </MainButton>
      <p className="text-grey-500 mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </Card>
  );
};
