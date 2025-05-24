"use client";

import MainButton from "@/components/shared/button";
import { Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <MainButton
      variant="secondary"
      isIconOnly
      icon={<Sun />}
      size="icon"
      className="group/toggle fixed top-0 right-0 size-8"
      onClick={toggleTheme}
    />
  );
}
