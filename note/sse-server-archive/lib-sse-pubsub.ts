// Archived from src/lib/sse/pubsub.ts
// eslint-disable-next-line unicorn/prevent-abbreviations
import type { SSEEvent } from "@/lib/sse/types";

class PubSub {
  private channels = new Map<string, Set<(event: SSEEvent) => void>>();

  private eventName(channel: string) {
    return `sse:${channel}`;
  }

  subscribe(channel: string, handler: (event: SSEEvent) => void) {
    const name = this.eventName(channel);
    const set = this.channels.get(name) ?? new Set();
    set.add(handler);
    this.channels.set(name, set);

    return () => {
      const current = this.channels.get(name);
      if (!current) return;
      current.delete(handler);
      if (current.size === 0) this.channels.delete(name);
    };
  }

  publish(channel: string, event: SSEEvent) {
    const name = this.eventName(channel);
    const set = this.channels.get(name);
    if (!set) return;
    for (const handler of set) {
      try {
        handler(event);
      } catch {
        // ignore
      }
    }
  }
}

const g = globalThis as unknown as { __SSE_PUBSUB__?: PubSub };
export const pubsub: PubSub = g.__SSE_PUBSUB__ ?? new PubSub();
if (!g.__SSE_PUBSUB__) g.__SSE_PUBSUB__ = pubsub;

export default pubsub;
