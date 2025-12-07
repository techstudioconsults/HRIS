/* eslint-disable no-console */
"use client";

import { Button } from "@workspace/ui/components/button";
import { Logo } from "@workspace/ui/lib";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Root error:", error);
  }, [error]);

  return (
    <div className="bg-background flex !h-[70dvh] flex-col items-center justify-center rounded-md shadow dark:bg-[#000000]">
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertCircle className="text-destructive h-12 w-12" />
        <Logo width={100} height={47} />
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">Something went wrong!</h2>
          <p className="text-muted-foreground text-sm">{error.message || "An unexpected error occurred"}</p>
          {error.digest && <p className="text-muted-foreground text-xs">Error ID: {error.digest}</p>}
        </div>
        <Button onClick={reset} variant="default" className="mt-2">
          Try again
        </Button>
      </div>
    </div>
  );
}
