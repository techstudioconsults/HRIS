import { KBarProviderWrapper } from "@/lib/kbar/kbar-provider";
import { fontVariables } from "@/lib/tools/font";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "@workspace/ui/globals.css";
import "@workspace/ui/themes.css";

import { SessionProvider } from "@/components/SessionProvider";
import { SSEProvider } from "@/context/sse-provider";
import { ReactQueryProvider } from "@/lib/react-query/query-provider";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { ThemeProvider } from "next-themes";
import { Toast } from "@workspace/ui/lib";
// import { ModeToggle } from "@workspace/ui/components/core/layout/ThemeToggle/theme-toggle";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const METADATA: Metadata = {
  title: "HRIS",
  description: "A New HR System by Techstudio Academy",
};

export const VIEWPORT: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

const INNER_HTML = {
  __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={INNER_HTML} />
      </head>
      <body
        className={cn(
          "bg-background font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
          fontVariables,
        )}
      >
        <SessionProvider>
          <SSEProvider>
            <NextTopLoader showSpinner={false} />
            <ReactQueryProvider>
              <NuqsAdapter>
                <TooltipProvider>
                  <ThemeProvider>
                    <Toast />
                    {/* <ModeToggle /> */}
                    {/* <NetworkStatusModal /> */}
                    <KBarProviderWrapper>{children}</KBarProviderWrapper>
                  </ThemeProvider>
                </TooltipProvider>
              </NuqsAdapter>
            </ReactQueryProvider>
          </SSEProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
