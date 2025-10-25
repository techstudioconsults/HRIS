import { KBarProviderWrapper } from "@/lib/kbar/kbar-provider";
import { fontVariables } from "@/lib/tools/font";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "../styles/theme.css";
import "../styles/global.css";

import { SessionProvider } from "@/components/core/layout/SessionProvider";
import { Toast } from "@/components/shared/Toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQueryProvider } from "@/lib/react-query/query-provider";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const metadata: Metadata = {
  title: "HRIS",
  description: "A New HR System by Techstudio Academy",
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
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
          <NextTopLoader showSpinner={false} />
          <NuqsAdapter>
            <ReactQueryProvider>
              <TooltipProvider>
                {/* <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                  enableColorScheme
                > */}
                <KBarProviderWrapper>{children}</KBarProviderWrapper>
                <Toast />
                {/* </ThemeProvider> */}
              </TooltipProvider>
            </ReactQueryProvider>
          </NuqsAdapter>
        </SessionProvider>
      </body>
    </html>
  );
}
