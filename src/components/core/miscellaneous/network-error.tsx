"use client";

import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const NetworkStatusModal = () => {
  const [, setIsOnline] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      setIsOpen(!navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
        setIsOpen(false);
        window.location.reload();
      };

      const handleOffline = () => {
        setIsOnline(false);
        setIsOpen(true);
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  return (
    <ReusableDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title="No Internet Connection"
      description="Your device is currently offline. Please check your network connection."
      className="text-center"
      wrapperClassName="flex flex-col items-center gap-4 text-center"
      headerClassName="flex flex-col items-center text-center gap-2"
      trigger={undefined}
    >
      <div className="flex flex-col items-center gap-4 p-4">
        <AlertCircle className="text-mid-danger h-12 w-12" />
        <p className="text-mid-grey-III text-sm">Some features may not be available while offline.</p>
        <div className="bg-mid-grey-II mt-4 h-[1px] w-full" />
        <button
          onClick={() => setIsOpen(false)}
          className="bg-mid-danger hover:bg-mid-danger focus:ring-mid-danger w-full rounded-md px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          Dismiss
        </button>
      </div>
    </ReusableDialog>
  );
};
