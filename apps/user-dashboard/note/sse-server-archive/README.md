Archived SSE server implementation (Next.js route handlers). Not active in the app.

Files archived from src:
- app/api/sse/route.ts
- app/api/sse/publish/route.ts
- app/api/dev/sse-demo/route.ts
- lib/sse/pubsub.ts (in-memory pub/sub)

Use cases:
- Study reference for building SSE on Next.js
- Replaceable by NestJS backend (recommended for this project)

Client configuration:
- Set NEXT_PUBLIC_SSE_URL to your NestJS SSE endpoint, e.g. https://api.example.com/sse
- The SSEProvider will connect to that URL.
