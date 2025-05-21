"use client";

import { ProgressProvider } from "@bprogress/next/app";

export const ProgressProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider
      height="4px"
      // color={`#${Math.floor(Math.random() * 16_777_215).toString(16)}`}
      color={`#FF0000`}
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};
