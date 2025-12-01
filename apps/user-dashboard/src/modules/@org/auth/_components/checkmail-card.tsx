import { MainButton } from "@workspace/ui/lib/button";
import Link from "next/link";

export const CheckMailCard = () => {
  return (
    <section className="mx-auto max-w-[589px] rounded-xl bg-white p-8 shadow-2xl shadow-gray-100">
      <div className={`mb-8 space-y-2`}>
        <h3 className="text-[32px]/[120%] font-[600] tracking-[-2%] text-black">Forgot Password</h3>
        <p className={`text-gray text-lg`}>Enter your email address to reset your password</p>
      </div>
      <MainButton type="submit" variant="primary" className="w-full" size="2xl">
        Continue
      </MainButton>
      <p className="text-grey-500 mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </section>
  );
};
