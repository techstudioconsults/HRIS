"use client";

import type { NotificationEvent, SSEEvent, SSEEventType } from "@/lib/sse/types";
import { useAuthStore } from "@/stores/auth-store";
import { useSession } from "next-auth/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type SSEStatus = "connecting" | "open" | "closed" | "error";

type Listener = (event: SSEEvent) => void;

type SSEContextValue = {
  status: SSEStatus;
  on: (type: SSEEventType | "*", listener: Listener) => () => void;
};

const SSEContext = createContext<SSEContextValue | null>(null);

export function SSEProvider({
  channels = ["global"],
  autoToast = true,
  endpoint,
  children,
}: {
  channels?: string[];
  autoToast?: boolean;
  endpoint?: string; // e.g. https://api.example.com/sse
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<SSEStatus>("connecting");
  const listenersReference = useRef(new Map<string, Set<Listener>>());
  const sourceReference = useRef<EventSource | null>(null);
  const { user } = useAuthStore();
  const { data: session } = useSession();

  const getUserId = useCallback((u: unknown): string | undefined => {
    if (!u || typeof u !== "object") return undefined;
    const object = u as Record<string, unknown>;
    const direct = object["id"];
    if (typeof direct === "string" && direct) return direct;
    const employee = object["employee"] as Record<string, unknown> | undefined;
    const empId = employee && typeof employee["id"] === "string" ? (employee["id"] as string) : undefined;
    return empId;
  }, []);

  const emit = useCallback((type: SSEEventType | "*", event: SSEEvent) => {
    const all = listenersReference.current.get("*");
    const set = listenersReference.current.get(type);
    if (all) for (const callback of all) callback(event);
    if (set) for (const callback of set) callback(event);
  }, []);

  const handleNotificationToast = useCallback((event: NotificationEvent) => {
    const level = event.data.level ?? "info";
    const title = event.data.title ?? "Notification";
    const message = event.data.message;

    const options = { description: message } as const;
    switch (level) {
      case "success": {
        toast.success(title, options);
        break;
      }
      case "warning": {
        toast.warning(title, options);
        break;
      }
      case "error": {
        toast.error(title, options);
        break;
      }
      default: {
        toast.info(title, options);
      }
    }
  }, []);

  useEffect(() => {
    const environmentEndpoint = process.env.NEXT_PUBLIC_SSE_URL;
    const base = endpoint ?? environmentEndpoint ?? "";
    const userId: string | undefined = getUserId(user);

    if (!base || !userId) {
      // No endpoint configured; don't attempt to connect.
      setStatus("closed");
      if (typeof window !== "undefined") {
        // eslint-disable-next-line no-console
        console.warn("SSEProvider: Missing NEXT_PUBLIC_SSE_URL/endpoint or user id; SSE disabled.");
      }
      return;
    }
    const trimmedBase = base.replace(/\/$/, "");
    // If backend path targets notifications users endpoint, append /users/:userId
    const shouldAppendUserPath = /\/notifications\/users$/.test(trimmedBase) || /\/users$/.test(trimmedBase);
    const url = shouldAppendUserPath
      ? `${trimmedBase}/${userId}`
      : `${trimmedBase}${trimmedBase.includes("?") ? "&" : "?"}channels=${encodeURIComponent(channels.join(","))}`;
    const accessToken = (session as unknown as { tokens?: { accessToken?: string } } | undefined)?.tokens?.accessToken;
    const tokenSuffix = accessToken ? `${url.includes("?") ? "&" : "?"}token=${encodeURIComponent(accessToken)}` : "";
    const finalUrl = `${url}${tokenSuffix}`;
    const es = new EventSource(finalUrl, { withCredentials: true });
    sourceReference.current = es;

    setStatus("connecting");

    es.addEventListener("open", () => setStatus("open"));
    es.addEventListener("error", () => setStatus("error"));

    const onEvent = (type: SSEEventType) => (messageEvent: MessageEvent) => {
      try {
        const parsed = JSON.parse((messageEvent as MessageEvent<string>).data) as unknown;
        const rec = (parsed ?? {}) as Record<string, unknown>;
        const hasType = typeof rec["type"] === "string";
        const hasData = Object.prototype.hasOwnProperty.call(rec, "data");
        const hasTimestamp = Object.prototype.hasOwnProperty.call(rec, "timestamp");
        const hasChannel = Object.prototype.hasOwnProperty.call(rec, "channel");
        if (hasType && hasData && hasTimestamp && hasChannel) {
          const sseEvent = parsed as SSEEvent;
          emit("*", sseEvent);
          emit(type, sseEvent);
          if (autoToast && type === "notification") {
            handleNotificationToast(sseEvent as NotificationEvent);
          }
          return;
        }
      } catch {
        // fall through to message handler
      }
    };

    es.addEventListener("notification", onEvent("notification"));
    es.addEventListener("log", onEvent("log"));
    es.addEventListener("progress", onEvent("progress"));

    // Fallback handler: adapt backend INotificationPayload -> internal NotificationEvent
    es.addEventListener("message", (messageEvent) => {
      try {
        const raw = JSON.parse((messageEvent as MessageEvent<string>).data) as {
          type?: string;
          data?: { title?: string; body?: string; metadata?: unknown };
          timestamp?: string | number;
        };
        if (!raw || typeof raw !== "object") return;
        const title = raw.data?.title ?? "Notification";
        const body = raw.data?.body ?? "";
        const when =
          typeof raw.timestamp === "string" || typeof raw.timestamp === "number"
            ? new Date(raw.timestamp).getTime()
            : Date.now();
        const event: SSEEvent = {
          id: globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2),
          type: "notification",
          channel: `users:${getUserId(user) ?? "unknown"}`,
          timestamp: Number.isFinite(when) ? (when as number) : Date.now(),
          data: { title, message: body },
        } as NotificationEvent;
        emit("*", event);
        emit("notification", event);
        if (autoToast) {
          handleNotificationToast(event as NotificationEvent);
        }
      } catch {
        // ignore invalid payloads
      }
    });

    return () => {
      setStatus("closed");
      es.close();
      sourceReference.current = null;
    };
  }, [channels, autoToast, endpoint, emit, handleNotificationToast, user, getUserId, session]);

  const on = useCallback<SSEContextValue["on"]>((type, listener) => {
    const set = listenersReference.current.get(type) ?? new Set();
    set.add(listener);
    listenersReference.current.set(type, set);
    return () => {
      const current = listenersReference.current.get(type);
      if (!current) return;
      current.delete(listener);
      if (current.size === 0) listenersReference.current.delete(type);
    };
  }, []);

  const value = useMemo<SSEContextValue>(() => ({ status, on }), [status, on]);

  return <SSEContext.Provider value={value}>{children}</SSEContext.Provider>;
}

export function useSSEContext() {
  const context = useContext(SSEContext);
  if (!context) throw new Error("useSSEContext must be used within SSEProvider");
  return context;
}
