import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const OTPInput = () => {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup className={`justify-between gap-4`}>
        <InputOTPSlot className={`border-border size-18 rounded-md border text-3xl font-bold`} index={0} />
        <InputOTPSlot className={`border-border size-18 rounded-md border text-3xl font-bold`} index={1} />
        <InputOTPSlot className={`border-border size-18 rounded-md border text-3xl font-bold`} index={2} />
        <InputOTPSlot className={`border-border size-18 rounded-md border text-3xl font-bold`} index={3} />
        <InputOTPSlot className={`border-border size-18 rounded-md border text-3xl font-bold`} index={4} />
        <InputOTPSlot className={`border-border size-18 rounded-md border text-3xl font-bold`} index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
};

export default OTPInput;
