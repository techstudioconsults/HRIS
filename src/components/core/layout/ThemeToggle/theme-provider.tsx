"use client";

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";

export default function ThemeProvider({ children, ...properties }: ThemeProviderProps) {
  return <NextThemesProvider {...properties}>{children}</NextThemesProvider>;
}
