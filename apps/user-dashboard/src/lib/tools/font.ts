// @/lib/tools/font.ts
import { cn } from "@workspace/ui/lib/utils";
import { Fira_Code, Work_Sans } from "next/font/google";

// Primary sans-serif font (clean, modern, highly readable)
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Monospace font for code blocks/technical content
const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
});

// Secondary sans-serif font for headings/accent
const workSansHeading = Work_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const fontVariables = cn(workSans.variable, firaCode.variable, workSansHeading.variable);
// export {};
