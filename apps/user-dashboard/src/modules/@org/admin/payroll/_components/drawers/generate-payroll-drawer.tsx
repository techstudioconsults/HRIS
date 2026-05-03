'use client';

import { formatCurrency, formatDate } from '@/lib/formatters';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Badge } from '@workspace/ui/components/badge';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@workspace/ui/components/drawer';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

import { CalendarModal } from '@/modules/@org/admin/payroll/_components/calendar-modal';
import { usePayrollModalParams } from '@/lib/nuqs/use-payroll-modal-params';
import { DashboardCard } from '../../../../_components/dashboard-card';
import { usePayrollService } from '../../services/use-service';
import type { CompanyPayrollPolicy } from '../../types';

export interface GeneratePayrollDrawerProperties {
  payrollPolicy: CompanyPayrollPolicy | undefined;
  onGenerated: (payrollId: string) => void;
}

export const GeneratePayrollDrawer = ({
  payrollPolicy,
  onGenerated,
}: GeneratePayrollDrawerProperties) => {
  const { isCreatePayrollOpen, closeModal: closeCreatePayroll } =
    usePayrollModalParams();

  const { useGetCompanyWallet, useCreatePayroll, useGetApprovedBanks } =
    usePayrollService();

  const { data: companyWallet } = useGetCompanyWallet();
  const { mutateAsync: createPayroll, isPending: isCreating } =
    useCreatePayroll();
  const { data: approvedBanks } = useGetApprovedBanks();

  const [isNetPayVisible, setIsNetPayVisible] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    new Date()
  );

  const walletBalance = companyWallet?.data?.balance ?? 0;
  const approvers = payrollPolicy?.approvers ?? [];
  const payday = payrollPolicy?.payday;
  const frequency = payrollPolicy?.frequency ?? 'monthly';

  const draftPaydayLabel = (() => {
    if (!payday || payday <= 0) return '';
    const now = new Date();
    const draftDate = new Date(now.getFullYear(), now.getMonth(), payday);
    return formatDate(draftDate);
  })();

  const draftPaydayDate = (() => {
    if (!payday || payday <= 0) return null;
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), payday);
  })();

  const handleGenerate = async (paymentDate?: string) => {
    const policyId = payrollPolicy?.id;
    if (!policyId) {
      toast.error(
        'Payroll policy not found. Please set up payroll settings first.'
      );
      return;
    }

    try {
      const result = await createPayroll({
        payrollPolicyId: policyId,
        paymentDate,
      });
      const newPayrollId = result?.data?.id;
      closeCreatePayroll();
      if (newPayrollId) {
        onGenerated(newPayrollId);
      }
      toast.success('Payroll generated successfully');
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ?? 'Failed to generate payroll.';
      toast.error('Something went wrong', { description: message });
    }
  };

  const handleInstantGenerate = () => {
    handleGenerate(draftPaydayDate ? draftPaydayDate.toISOString() : undefined);
  };

  const handleScheduledGenerate = async (date: Date | undefined) => {
    if (!date) {
      toast.error('Please select a date to continue.');
      return;
    }
    setIsCalendarOpen(false);
    await handleGenerate(date.toISOString());
  };

  return (
    <>
      <Drawer
        open={isCreatePayrollOpen}
        onOpenChange={(open) => {
          if (!open) closeCreatePayroll();
        }}
        direction="right"
      >
        <DrawerContent className="h-full w-full! sm:max-w-xl!">
          <DrawerHeader className="border-b pb-4">
            <div className="flex items-center justify-between gap-10">
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                  <Icon name="Add" size={20} className="text-primary" />
                </div>
                <div>
                  <DrawerTitle className="text-lg font-semibold">
                    Generate Payroll
                  </DrawerTitle>
                  <DrawerDescription>
                    Create a new payroll run for{' '}
                    {frequency.charAt(0).toUpperCase() + frequency.slice(1)}{' '}
                    processing
                  </DrawerDescription>
                </div>
              </div>
              <DrawerClose className="text-primary" asChild>
                <Icon name="CloseCircle" />
              </DrawerClose>
            </div>
          </DrawerHeader>

          <section className="flex-1 space-y-6 overflow-y-auto p-6">
            <h1 className="text-xl font-bold">Summary Overview</h1>

            {draftPaydayLabel && (
              <div className="bg-accent/10 border-accent item-center flex gap-4 rounded-lg border p-4 text-sm text-gray-500">
                <div className="size-8">
                  <Icon name="Info" size={20} />
                </div>
                <p>
                  A new payroll will be generated for{' '}
                  <strong>{draftPaydayLabel}</strong> based on your payroll
                  policy settings.
                </p>
              </div>
            )}

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DashboardCard
                title="Processing Bank"
                value={
                  <p className="text-base">
                    {approvedBanks?.data?.[0]?.name ?? '—'}
                  </p>
                }
                className="bg-muted flex flex-col items-center justify-center gap-4 text-center shadow-none"
              />
              <DashboardCard
                title="Wallet Balance"
                value={
                  <div className="flex items-center gap-4">
                    <p className="text-base text-white">
                      {isNetPayVisible
                        ? formatCurrency(walletBalance)
                        : '••••••••'}
                    </p>
                    <button
                      onClick={() => setIsNetPayVisible(!isNetPayVisible)}
                      className="text-white transition-colors hover:text-gray-300"
                      aria-label={
                        isNetPayVisible ? 'Hide balance' : 'Show balance'
                      }
                    >
                      {isNetPayVisible ? (
                        <Icon
                          name="EyeSlash"
                          size={30}
                          className="text-white"
                        />
                      ) : (
                        <Icon name="Eye" size={30} className="text-white" />
                      )}
                    </button>
                  </div>
                }
                className="flex flex-col items-center justify-center gap-4 bg-linear-to-r from-brand-gradient-from to-brand-gradient-to text-center"
                titleColor="text-white"
              />
            </section>

            <section>
              <h1 className="text-xl font-bold">Approvers</h1>
              <section className="bg-muted space-y-4 rounded-lg p-4">
                {approvers.length === 0 ? (
                  <div className="text-muted-foreground text-sm">
                    No approvers configured. Configure approvers in Payroll
                    Settings.
                  </div>
                ) : (
                  approvers.map((approver) => {
                    const initials =
                      approver.name
                        .split(' ')
                        .map((part) => part.charAt(0))
                        .join('')
                        .toUpperCase()
                        .slice(0, 2) || 'AP';

                    return (
                      <section
                        key={approver.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage
                              src={
                                approver.avatar ??
                                'https://github.com/shadcn.png'
                              }
                              alt={approver.name}
                            />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-foreground text-sm font-medium">
                              {approver.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {approver.role}
                            </p>
                          </div>
                        </div>
                        <Badge className="rounded-full bg-warning-50 px-4 py-2 text-warning">
                          Pending
                        </Badge>
                      </section>
                    );
                  })
                )}
              </section>
            </section>
          </section>

          <DrawerFooter className="border-t p-6">
            <div className="flex gap-3">
              {/*<MainButton*/}
              {/*  variant="destructiveOutline"*/}
              {/*  className="border-destructive text-destructive flex-1"*/}
              {/*  onClick={() => closeCreatePayroll()}*/}
              {/*>*/}
              {/*  Cancel*/}
              {/*</MainButton>*/}
              <MainButton
                variant="primaryOutline"
                type="button"
                onClick={() => setIsCalendarOpen(true)}
                isLoading={isCreating}
                isDisabled={isCreating}
                className="flex-1"
              >
                {isCreating ? 'Generating...' : 'Schedule Payroll'}
              </MainButton>
              <MainButton
                variant="primary"
                type="button"
                onClick={handleInstantGenerate}
                isLoading={isCreating}
                isDisabled={isCreating}
                className="flex-1"
              >
                {isCreating ? 'Generating...' : 'Generate Payroll'}
              </MainButton>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <CalendarModal
        open={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
        selectedDate={scheduledDate}
        onDateSelect={setScheduledDate}
        onContinue={handleScheduledGenerate}
        isSubmitting={isCreating}
      />
    </>
  );
};
