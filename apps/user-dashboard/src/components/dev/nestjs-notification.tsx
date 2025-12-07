"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect, useMemo, useRef, useState } from "react";

type Properties = {
  endpoint?: string; // e.g. http://localhost:5000/api/v1/notifications/:userId
};

export default function NestjsNotification({ endpoint }: Properties) {
  const { user } = useAuthStore();
  const [data, setData] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "connecting" | "open" | "error" | "closed">("idle");
  const sourceReference = useRef<EventSource | null>(null);

  const userId = useMemo(() => {
    if (!user || typeof user !== "object") return;
    const object = user as Record<string, unknown>;
    if (typeof object["id"] === "string" && object["id"]) return object["id"] as string;
    const employee = object["employee"] as Record<string, unknown> | undefined;
    if (employee && typeof employee["id"] === "string") return employee["id"] as string;
    return;
  }, [user]);

  const url = useMemo(() => {
    const base = endpoint ?? process.env.NEXT_PUBLIC_SSE_URL ?? "";
    if (!base || !userId) return "";

    // Replace template placeholder if present
    if (base.includes(":userId")) return base.replace(":userId", userId);
    if (base.includes("{userId}")) return base.replace("{userId}", userId);

    // If the base looks like /notifications/users, append /:userId
    const trimmed = base.replace(/\/$/, "");
    const usersPattern = /\/notifications\/users$|\/users$/;
    if (usersPattern.test(trimmed)) return `${trimmed}/${userId}`;

    // Otherwise assume the provided endpoint is already user-specific
    return trimmed;
  }, [endpoint, userId]);

  useEffect(() => {
    if (!url) {
      setStatus("closed");
      return;
    }
    setStatus("connecting");
    const es = new EventSource(url, { withCredentials: true });
    sourceReference.current = es;

    es.addEventListener("open", () => setStatus("open"));
    es.addEventListener("error", () => setStatus("error"));
    es.addEventListener("message", (event) => {
      const messageEvent = event as MessageEvent<string>;
      if (messageEvent.data) setData(messageEvent.data);
    });

    return () => {
      setStatus("closed");
      es.close();
      sourceReference.current = null;
    };
  }, [url]);

  let display: string = data;
  try {
    display = JSON.stringify(JSON.parse(data), null, 2);
  } catch {
    // keep as text
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">NestJS Notification Demo</CardTitle>
        <div className="muted-foreground text-xs">{url ? `Listening: ${url}` : "No URL configured"}</div>
        <div className="muted-foreground text-xs">Status: {status}</div>
      </CardHeader>
      <CardContent>
        <pre className="text-xs break-words whitespace-pre-wrap">{display || "(no messages yet)"}</pre>
      </CardContent>
    </Card>
  );
}
