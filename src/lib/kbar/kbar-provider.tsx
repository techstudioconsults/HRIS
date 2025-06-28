"use client";

import { KBarAnimator, KBarPortal, KBarPositioner, KBarProvider, KBarResults, KBarSearch, useMatches } from "kbar";
import { useRouter } from "next/navigation";
import { ReactNode, useMemo } from "react";

export function KBarProviderWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Actions that don't depend on component state
  const staticActions = useMemo(
    () => [
      {
        id: "home",
        name: "Home",
        shortcut: ["h"],
        keywords: "go home",
        perform: () => router.push("/"),
      },
      {
        id: "dashboard",
        name: "Dashboard",
        shortcut: ["g", "d"],
        keywords: "go dashboard",
        perform: () => router.push("/dashboard"),
      },
      {
        id: "settings",
        name: "Settings",
        shortcut: ["g", "s"],
        keywords: "go settings",
        perform: () => router.push("/settings"),
      },
    ],
    [router],
  );

  return (
    <KBarProvider actions={staticActions}>
      <KBarPortal>
        <KBarPositioner className="z-50 bg-black/50 backdrop-blur-sm">
          <KBarAnimator className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
            <KBarSearch className="w-full border-none bg-transparent px-4 py-3 text-gray-900 placeholder-gray-500 outline-none dark:text-gray-100 dark:placeholder-gray-400" />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}

function RenderResults() {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="bg-gray-100 px-4 py-2 text-xs text-gray-500 uppercase dark:bg-gray-700 dark:text-gray-400">
            {item}
          </div>
        ) : (
          <div
            className={`flex cursor-pointer items-center justify-between px-4 py-3 ${
              active
                ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                : "bg-transparent text-gray-700 dark:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <div className="flex flex-col">
                <span>{item.name}</span>
                {item.subtitle && <span className="text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</span>}
              </div>
            </div>
            {item.shortcut?.length && (
              <div className="flex gap-1">
                {item.shortcut.map((shortcut) => (
                  <kbd key={shortcut} className="rounded bg-gray-200 px-2 py-1 font-mono text-xs dark:bg-gray-600">
                    {shortcut}
                  </kbd>
                ))}
              </div>
            )}
          </div>
        )
      }
    />
  );
}
