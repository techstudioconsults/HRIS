'use client';

import { useSSE } from '@/context/sse-provider';
import type { LogEvent, ProgressEvent } from '@/lib/sse/types';
import type { INotificationPayload } from '@/lib/sse/use-notifications';
import type { SSEProgressWidgetProperties } from '@/modules/@org/shared/types';
import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Progress } from '@workspace/ui/components/progress';

function isProgressEvent(value: unknown): value is ProgressEvent {
  const event_ = value as Partial<ProgressEvent> | null;
  return Boolean(
    event_ &&
    event_.type === 'progress' &&
    typeof event_.channel === 'string' &&
    typeof event_.data === 'object' &&
    event_.data &&
    true
  );
}

function isLogEvent(value: unknown): value is LogEvent {
  const event_ = value as Partial<LogEvent> | null;
  return Boolean(
    event_ &&
    event_.type === 'log' &&
    typeof event_.channel === 'string' &&
    typeof event_.data === 'object' &&
    event_.data &&
    true &&
    true
  );
}

export function SSEProgressWidget({
  channel,
  title = 'Live Job Progress',
}: SSEProgressWidgetProperties) {
  const { on, status } = useSSE();
  const [percent, setPercent] = useState(0);
  const [message, setMessage] = useState<string | undefined>();
  const [lastLog, setLastLog] = useState<string | undefined>();

  useEffect(() => {
    const off = on('progress', (payload: INotificationPayload<unknown>) => {
      const candidate = payload.data?.metadata ?? payload;
      if (!isProgressEvent(candidate) || candidate.channel !== channel) return;

      const next = Math.max(0, Math.min(100, candidate.data.percent));
      setPercent(next);
      if (candidate.data.message) setMessage(candidate.data.message);
    });
    return () => off();
  }, [channel, on]);

  useEffect(() => {
    const off = on('log', (payload: INotificationPayload<unknown>) => {
      const candidate = payload.data?.metadata ?? payload;
      if (!isLogEvent(candidate) || candidate.channel !== channel) return;

      setLastLog(
        `${candidate.data.level.toUpperCase()}: ${candidate.data.message}`
      );
    });
    return () => off();
  }, [channel, on]);

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'open': {
        return 'Connected';
      }
      case 'connecting': {
        return 'Connecting…';
      }
      case 'error': {
        return 'Connection error';
      }
      default: {
        return 'Disconnected';
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
          <span className="text-muted-foreground">
            {message ?? 'Waiting for updates…'}
          </span>
          <span className="font-medium tabular-nums">{percent}%</span>
        </div>
        <Progress value={percent} />
        {lastLog ? (
          <div className="bg-muted text-muted-foreground rounded-md p-2 text-xs">
            {lastLog}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
