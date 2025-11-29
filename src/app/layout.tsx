import { KBarProviderWrapper } from "@/lib/kbar/kbar-provider";
import { fontVariables } from "@/lib/tools/font";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "../styles/global.css";
import "../styles/theme.css";

import { SessionProvider } from "@/components/core/layout/SessionProvider";
import ThemeProvider from "@/components/core/layout/ThemeToggle/theme-provider";
import { ModeToggle } from "@/components/core/layout/ThemeToggle/theme-toggle";
import { NetworkStatusModal } from "@/components/core/miscellaneous/network-error";
import { Toast } from "@/components/shared/Toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SSEProvider } from "@/context/sse-provider";
import { ReactQueryProvider } from "@/lib/react-query/query-provider";

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
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    enableColorScheme
                  >
                    <Toast />
                    {/* <ModeToggle /> */}
                    <NetworkStatusModal />
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
