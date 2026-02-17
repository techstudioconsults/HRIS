"use client";

import {ReusableDialog} from "@workspace/ui/lib";
import {MainButton} from "@workspace/ui/lib/button";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

/**
 * Lightweight reminder modal for admin leave setup.
 * Shows automatically when visiting the leave page.
 */
export const LeaveSetupModal = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Show modal on mount
  useEffect(() => {
    setOpen(true);
  }, []);

  return (
      <ReusableDialog
          open={open}
          onOpenChange={setOpen}
          trigger={null}
          title="Set up Leave Types"
          description="Create at least one leave type (e.g., Annual Leave) to begin managing leave in your organization."
          className="min-w-md"
      >
        <div className="space-y-6">
          <div className="bg-primary/10 border-primary-75 rounded-lg border p-5">
            <h6 className="mb-2 font-semibold text-gray-900">What you&apos;ll do:</h6>
            <ul className="ml-4 space-y-2 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="mr-2 size-1 flex-shrink-0 rounded-full bg-gray-400"/>
                Create leave types with cycles and day limits
              </li>
              <li className="flex items-center">
                <span className="mr-2 size-1 flex-shrink-0 rounded-full bg-gray-400"/>
                View employee leave requests in the Leave Hub
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <MainButton
                variant="primary"
                className="w-full"
                onClick={() => {
                  setOpen(false);
                  router.push("/admin/leave/type");
                }}
            >
              Manage Leave Types
            </MainButton>

            <MainButton
                onClick={() => setOpen(false)}
                className="text-center text-sm text-gray-600 hover:text-gray-800 hover:underline"
            >
              Remind me later
            </MainButton>
          </div>
        </div>
      </ReusableDialog>
  );
};
