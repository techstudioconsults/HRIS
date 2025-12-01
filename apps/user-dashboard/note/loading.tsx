"use client";

import { Logo } from "@workspace/ui/lib";
import { cn } from "@workspace/ui/lib/utils";
import { LucideLoader } from "lucide-react";

export default function Loading({ text, className }: { text?: string; className?: string }) {
  return (
    <div
      className={cn(
        "bg-background flex !h-[70dvh] flex-col items-center justify-center rounded-md shadow dark:bg-[#000000]",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <LucideLoader className="text-primary animate-spin" />
        <Logo width={100} height={47} />
        <div className="flex items-center gap-1">{<p className="text-sm font-medium">{text || "Loading..."}</p>}</div>
      </div>
    </div>
  );
}
