import { InputOTP, InputOTPGroup, InputOTPSlot } from "@workspace/ui/components/input-otp";

interface OTPInputProperties {
  value: string;
  onChange: (value: string) => void;
}

export const OTPInput = ({ value, onChange }: OTPInputProperties) => {
  return (
    <InputOTP maxLength={6} value={value} onChange={onChange}>
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
