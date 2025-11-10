"use client";

import { useSSEContext } from "@/context/sse-provider";
import type { SSEEvent, SSEEventType } from "@/lib/sse/types";
import { useEffect } from "react";

export function useSSE() {
  return useSSEContext();
}

export function useSSEEvent(type: SSEEventType | "*", handler: (event: SSEEvent) => void) {
  const { on } = useSSEContext();
  useEffect(() => {
    const off = on(type, handler);
    return () => off();
  }, [type, handler, on]);
}
