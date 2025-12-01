// Archived from src/app/api/sse/route.ts
import pubsub from "@/lib/sse/pubsub";
import type { SSEEvent } from "@/lib/sse/types";

export const dynamic = "force-dynamic";

function toSSE(event: SSEEvent) {
  return `id: ${event.id}\nevent: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channels = (searchParams.get("channels")?.split(",") ?? ["global"]).map((s) => s.trim()).filter(Boolean);

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(`retry: 10000\n\n`));
      controller.enqueue(encoder.encode(`: connected ${Date.now()}\n\n`));

      const unsubscribers: Array<() => void> = [];

      for (const channel of channels) {
        const unsubscribe = pubsub.subscribe(channel, (event: never) => {
          try {
            controller.enqueue(encoder.encode(toSSE(event)));
          } catch (error) {
            void error;
          }
        });
        unsubscribers.push(unsubscribe);
      }

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping ${Date.now()}\n\n`));
        } catch (error) {
          void error;
        }
      }, 15_000);

      const close = () => {
        clearInterval(heartbeat);
        for (const off of unsubscribers) off();
        try {
          controller.close();
        } catch (error) {
          void error;
        }
      };

      try {
        const signal: AbortSignal | undefined = (request as Request).signal;
        signal?.addEventListener("abort", close);
      } catch (error) {
        void error;
      }

      setTimeout(close, 60 * 60 * 1000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
