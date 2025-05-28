import MainButton from "@/components/shared/button";
import Link from "next/link";

import OTPInput from "../../_components/input-otp";

export const InputOtpCard = () => {
  return (
    <section className="mx-auto max-w-[589px] rounded-xl bg-white p-8 shadow-2xl shadow-gray-100">
      <div className={`mb-8 space-y-2`}>
        <h3 className="text-[32px]/[120%] font-[600] tracking-[-2%] text-black">Enter the 6-digit Code</h3>
        <p className={`text-gray text-lg`}>
          A verification code has been sent to <span className={`font-bold`}>“info@techstufioacademy@gmail.com”</span>
        </p>
      </div>
      <section>
        <OTPInput />
      </section>
      <div className={`mt-10`}>
        <MainButton type="submit" variant="primary" className="w-full" size="2xl">
          Login
        </MainButton>
        <p className="text-grey-500 mt-4 text-center text-sm">
          Didnt receive the code?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Resend
          </Link>
        </p>
        <p className="text-grey-500 mt-4 text-center text-sm">
          Wrong email?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Change email
          </Link>
        </p>
      </div>
    </section>
  );
};
