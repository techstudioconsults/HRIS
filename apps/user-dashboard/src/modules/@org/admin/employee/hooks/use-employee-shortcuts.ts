"use client";

import { useActiveTarget } from "@/context/active-target";
import { useShortcuts } from "@workspace/ui/hooks";
import { useRouter } from "next/navigation";

export function useEmployeeShortcuts() {
  const { entity: activeEmployee } = useActiveTarget<Employee>();
  const router = useRouter();

  useShortcuts(
    [
      {
        combo: "mod+v",
        run: () => activeEmployee && router.push(`/admin/employees/${activeEmployee.id}`),
        when: () => !!activeEmployee,
      },
      {
        combo: "mod+e",
        run: () => activeEmployee && router.push(`/admin/employees/edit-employee?employeeid=${activeEmployee.id}`),
        when: () => !!activeEmployee,
      },
      {
        combo: "mod+backspace",
        run: () => {
          if (!activeEmployee) return;
          const event_ = new CustomEvent("employee:request-delete");
          window.dispatchEvent(event_);
        },
        when: () => !!activeEmployee,
      },
      {
        combo: "mod+delete",
        run: () => {
          if (!activeEmployee) return;
          const event_ = new CustomEvent("employee:request-delete");
          window.dispatchEvent(event_);
        },
        when: () => !!activeEmployee,
      },
    ],
    [activeEmployee],
  );
}
