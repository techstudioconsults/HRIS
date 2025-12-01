"use client";

import { AlertModal } from "@/components/shared/dialog/alert-modal";
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
    <AlertModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      type="warning"
      title="No Internet Connection"
      description="Your device is currently offline. Please check your network connection. Some features may not be available while offline."
      confirmText="Dismiss"
      showCancelButton={false}
      containerClassName="bg-warning-50"
    />
  );
};
