# SSE (Server-Sent Events)

Lightweight real-time events for notifications, logs and progress.

This project now uses a backend SSE source (NestJS). The previous Next.js server implementation has been archived under `note/sse-server-archive/` for reference only.

- Client: `<SSEProvider>` in `src/context/sse-provider.tsx`
- Configure endpoint: set `NEXT_PUBLIC_SSE_URL` to your NestJS SSE stream, e.g. `https://api.example.com/sse`

Event shape:

```
{
  id: string,
  type: "notification" | "log" | "progress" | "custom",
  channel: string, // e.g. "global" or per-org
  timestamp: number,
  data: any
}
```

To subscribe in a component:

```
import { useSSEEvent } from "@/hooks/use-sse";

useSSEEvent("progress", (event) => console.log(event));

Notes:
- Ensure your backend enables CORS for SSE with credentials if you set `withCredentials: true`.
- Consider channel naming like `org:{id}`, `user:{id}`, `job:{id}` for targeted updates.
```
