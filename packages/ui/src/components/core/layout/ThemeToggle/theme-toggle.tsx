"use client";

import { MainButton } from "@workspace/ui/lib/button";
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
      variant="primary"
      isIconOnly
      icon={<Sun />}
      size="icon"
      className="group/toggle size-8"
      onClick={toggleTheme}
    />
  );
}
