"use client";

import { Toaster } from "@/components/ui/sonner";

export const Toast = () => {
  return <Toaster closeButton position="bottom-center" expand={false} duration={5000} />;
};
