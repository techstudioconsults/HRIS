import { fontVariables } from "@/lib/tools/font";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "../styles/theme.css";
import "../styles/global.css";

import ThemeProvider from "@/components/core/layout/ThemeToggle/theme-provider";
import { ModeToggle } from "@/components/core/layout/ThemeToggle/theme-toggle";
import { Toast } from "@/components/shared/Toast";
import { AppProvider } from "@/context/app-provider";
import { ReactQueryProvider } from "@/lib/react-query/query-provider";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const metadata: Metadata = {
  title: "Kingsley Solomon",
  description: "Kingsley solomon Portfolio",
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
        <AppProvider>
          <NextTopLoader showSpinner={false} />
          <NuqsAdapter>
            <ReactQueryProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                enableColorScheme
              >
                <Toast />
                <BaseLayout>{children}</BaseLayout>
                <ModeToggle />
              </ThemeProvider>
            </ReactQueryProvider>
          </NuqsAdapter>
        </AppProvider>
      </body>
    </html>
  );
}

export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={`max-w-screen overflow-x-hidden`}>
      <section className="grid min-h-[100dvh] grid-cols-1 justify-center py-12 md:-mx-4 md:grid-cols-[2.5rem_minmax(0,80rem)_2.5rem] lg:mx-0">
        <div className="cc-border-up hidden border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/10 md:block dark:[--pattern-fg:var(--color-white)]/10" />
        <section className={"grid gap-24 pb-24 text-gray-950 sm:gap-40 md:pb-40 dark:text-white"}>{children}</section>
        <div className="cc-border-down hidden border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/10 md:col-start-3 md:block dark:[--pattern-fg:var(--color-white)]/10" />
      </section>
    </main>
  );
}
