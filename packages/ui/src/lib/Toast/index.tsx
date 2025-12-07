"use client";

import { Toaster } from "@workspace/ui/components/sonner";

export const Toast = () => {
  return (
    <Toaster
      closeButton
      position="bottom-center"
      expand={false}
      duration={5000}
    />
  );
};
