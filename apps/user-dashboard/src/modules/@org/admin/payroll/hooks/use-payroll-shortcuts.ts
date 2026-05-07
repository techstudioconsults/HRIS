'use client';

import { useShortcuts } from '@workspace/ui/hooks';
import { usePayrollStore } from '../stores/payroll-store';

export function usePayrollShortcuts() {
  const {
    activePayslip,
    setEmployeeInformationActiveTab,
    setShowEmployeeInformationDrawer,
  } = usePayrollStore();

  useShortcuts([
    {
      id: 'payroll:view',
      combo: 'v',
      when: () => !!activePayslip,
      run: () => {
        if (!activePayslip) return;
        setEmployeeInformationActiveTab('employee-information');
        setShowEmployeeInformationDrawer(true);
      },
    },
    {
      id: 'payroll:edit',
      combo: 'e',
      when: () => !!activePayslip,
      run: () => {
        if (!activePayslip) return;
        setEmployeeInformationActiveTab('salary-details');
        setShowEmployeeInformationDrawer(true);
      },
    },
    {
      id: 'payroll:delete',
      combo: 'backspace',
      when: () => !!activePayslip,
      run: () => {
        if (!activePayslip) return;
        window.dispatchEvent(new CustomEvent('payroll:request-delete'));
      },
    },
    {
      id: 'payroll:delete-alt',
      combo: 'delete',
      when: () => !!activePayslip,
      run: () => {
        if (!activePayslip) return;
        window.dispatchEvent(new CustomEvent('payroll:request-delete'));
      },
    },
  ]);
}
