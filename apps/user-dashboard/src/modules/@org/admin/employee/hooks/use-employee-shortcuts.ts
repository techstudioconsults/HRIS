'use client';

import { useActiveTarget } from '@/context/active-target';
import { useShortcuts } from '@workspace/ui/hooks';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes/routes';

export function useEmployeeShortcuts() {
  const { entity: activeEmployee } = useActiveTarget<Employee>();
  const router = useRouter();

  useShortcuts(
    [
      {
        combo: 'v',
        run: () =>
          activeEmployee &&
          router.push(routes.admin.employees.detail(activeEmployee.id)),
        when: () => !!activeEmployee,
      },
      {
        combo: 'e',
        run: () =>
          activeEmployee &&
          router.push(routes.admin.employees.edit(activeEmployee.id)),
        when: () => !!activeEmployee,
      },
      {
        combo: 'backspace',
        run: () => {
          if (!activeEmployee) return;
          const event_ = new CustomEvent('employee:request-delete');
          window.dispatchEvent(event_);
        },
        when: () => !!activeEmployee,
      },
      {
        combo: 'delete',
        run: () => {
          if (!activeEmployee) return;
          const event_ = new CustomEvent('employee:request-delete');
          window.dispatchEvent(event_);
        },
        when: () => !!activeEmployee,
      },
    ],
    [activeEmployee]
  );
}
