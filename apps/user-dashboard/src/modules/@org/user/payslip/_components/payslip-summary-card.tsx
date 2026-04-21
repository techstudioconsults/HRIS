'use client';

import { formatCurrency } from '@/lib/formatters';
import Coin from '~/images/dashboard/coin.svg';
import { cn } from '@workspace/ui/lib/utils';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useState } from 'react';
import type { PayslipSummaryCardProps } from '../types';

export const PayslipSummaryCard = ({ netPay }: PayslipSummaryCardProps) => {
  const [isValueShown, setShowValue] = useState(false);

  const showValue = () => {
    setShowValue((prev) => !prev);
  };

  return (
    <section
      className={cn(
        'bg-primary flex w-full flex-col items-start gap-4 overflow-hidden rounded-lg p-4 shadow sm:p-6 lg:px-10',
        'bg-[url(/images/dashboard/Lines.svg)] bg-size-[180%] bg-right bg-no-repeat sm:bg-size-[130%] lg:bg-cover'
      )}
    >
      <div className="relative flex w-full flex-col gap-4 sm:flex-row sm:items-center">
        <Coin className="size-16 shrink-0 sm:size-20 lg:size-24" />

        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-[#F3F2FB]">Monthly Net Pay</p>

          <div className="flex items-baseline gap-3 sm:gap-4">
            <h2 className="truncate text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
              {isValueShown ? formatCurrency(netPay) : '**********'}
            </h2>
            <button
              type="button"
              onClick={showValue}
              className="shrink-0 rounded-md p-1 text-white/90 transition hover:text-white"
              aria-label={
                isValueShown ? 'Hide net pay amount' : 'Show net pay amount'
              }
            >
              <Icon
                name={isValueShown ? 'EyeSlash' : 'Eye'}
                className="size-6 sm:size-7"
              />
            </button>
          </div>

          <p className="max-w-xl text-sm text-[#E8ECF2]">
            Your current take-home pay for this month.
          </p>
        </div>
      </div>
    </section>
  );
};
