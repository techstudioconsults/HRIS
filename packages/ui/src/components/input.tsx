import { cn } from "../lib/utils";
import * as React from "react";

function Input({ className, type, ...properties }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 placeholder:text-gray flex h-9 w-full min-w-0 rounded-md border border-gray-100 bg-white px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...properties}
    />
  );
}

export { Input };
