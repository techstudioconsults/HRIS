"use client";

import { Button } from "@/components/ui/button";
import { IconBrightness } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <Button variant="secondary" size="icon" className="group/toggle size-8" onClick={toggleTheme}>
      <IconBrightness />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
