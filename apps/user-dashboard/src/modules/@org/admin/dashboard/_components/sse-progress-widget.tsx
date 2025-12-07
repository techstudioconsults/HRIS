"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSSEContext } from "@/context/sse-provider";
import type { LogEvent, ProgressEvent } from "@/lib/sse/types";
import { useEffect, useMemo, useState } from "react";

interface SSEProgressWidgetProperties {
  channel: string;
  title?: string;
}

export function SSEProgressWidget({ channel, title = "Live Job Progress" }: SSEProgressWidgetProperties) {
  const { status, on } = useSSEContext();
  const [percent, setPercent] = useState(0);
  const [message, setMessage] = useState<string | undefined>();
  const [lastLog, setLastLog] = useState<string | undefined>();

  useEffect(() => {
    const off = on("progress", (event) => {
      const progressEvent = event as ProgressEvent;
      if (progressEvent.channel !== channel) return;
      const next = Math.max(0, Math.min(100, progressEvent.data.percent));
      setPercent(next);
      if (progressEvent.data.message) setMessage(progressEvent.data.message);
    });
    return () => off();
  }, [channel, on]);

  useEffect(() => {
    const off = on("log", (event) => {
      const logEvent = event as LogEvent;
      if (logEvent.channel !== channel) return;
      setLastLog(`${logEvent.data.level.toUpperCase()}: ${logEvent.data.message}`);
    });
    return () => off();
  }, [channel, on]);

  const statusLabel = useMemo(() => {
    switch (status) {
      case "open": {
        return "Connected";
      }
      case "connecting": {
        return "Connecting…";
      }
      case "error": {
        return "Connection error";
      }
      default: {
        return "Disconnected";
      }
    }
  }, [status]);

  return (
    <Card className="border-muted-foreground/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="muted-foreground text-xs">
          Channel: {channel} • {statusLabel}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{message ?? "Waiting for updates…"}</span>
          <span className="font-medium tabular-nums">{percent}%</span>
        </div>
        <Progress value={percent} />
        {lastLog ? <div className="bg-muted text-muted-foreground rounded-md p-2 text-xs">{lastLog}</div> : null}
      </CardContent>
    </Card>
  );
}
