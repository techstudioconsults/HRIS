import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@workspace/ui/components/input-otp';

import type { OTPInputProperties } from '../types';

export const OTPInput = ({ value, onChange }: OTPInputProperties) => {
  return (
    <InputOTP
      maxLength={6}
      value={value}
      onChange={onChange}
      data-testid="otp-input"
    >
      <InputOTPGroup
        className={`flex w-full gap-2 justify-center lg:justify-around`}
      >
        <InputOTPSlot
          className={`border-border size-12 shadow-none lg:size-18 rounded-md border lg:text-3xl font-bold`}
          index={0}
        />
        <InputOTPSlot
          className={`border-border size-12 shadow-none lg:size-18 rounded-md border lg:text-3xl font-bold`}
          index={1}
        />
        <InputOTPSlot
          className={`border-border size-12 shadow-none lg:size-18 rounded-md border lg:text-3xl font-bold`}
          index={2}
        />
        <InputOTPSlot
          className={`border-border size-12 shadow-none lg:size-18 rounded-md border lg:text-3xl font-bold`}
          index={3}
        />
        <InputOTPSlot
          className={`border-border size-12 shadow-none lg:size-18 rounded-md border lg:text-3xl font-bold`}
          index={4}
        />
        <InputOTPSlot
          className={`border-border size-12 shadow-none lg:size-18 rounded-md border lg:text-3xl font-bold`}
          index={5}
        />
      </InputOTPGroup>
    </InputOTP>
  );
};
