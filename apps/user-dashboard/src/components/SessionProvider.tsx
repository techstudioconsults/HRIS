"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface SessionProviderProperties {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProperties) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
