export const dynamic = "force-dynamic";

// Archived: SSE server was part of a reference implementation.
// This project now relies on an external NestJS backend for SSE.
// Configure the client with NEXT_PUBLIC_SSE_URL to point to your backend.
export async function GET() {
  return new Response("SSE server is archived. Use your NestJS SSE endpoint.", { status: 410 });
}
