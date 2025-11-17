// Archived from src/app/api/sse/publish/route.ts
import pubsub from "@/lib/sse/pubsub";
import type { PublishBody, SSEEvent } from "@/lib/sse/types";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<PublishBody> & { event?: Partial<SSEEvent> };
  const channel = body.channel?.trim() || body.event?.channel?.trim() || "global";

  if (!body.event || !body.event.type) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid event payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const event: SSEEvent = {
    id: body.event.id ?? (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)),
    timestamp: body.event.timestamp ?? Date.now(),
    channel,
    type: body.event.type as SSEEvent["type"],
    data: (body.event as SSEEvent).data,
  } as SSEEvent;

  pubsub.publish(channel, event);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
