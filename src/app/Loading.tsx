"use client";

import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { LuLoader } from "react-icons/lu";

export default function Loading({ text, className }: { text?: string; className?: string }) {
  return (
    <div className={cn("flex h-screen flex-col items-center justify-center bg-white dark:bg-[#000000]", className)}>
      <div className="flex flex-col items-center gap-2">
        <Logo width={100} height={47} />
        <div className="flex items-center gap-1">
          <LuLoader className="text-primary animate-spin text-xl" />
          {<p className="text-sm font-medium">{text || "Loading..."}</p>}
        </div>
      </div>
    </div>
  );
}
