/* eslint-disable @typescript-eslint/no-explicit-any */
/*
  Next.js server-side proxy to bypass browser CORS.
  Usage: fetch('/api/proxy/<backend-path>?q=...')
  Env: BACKEND_URL must be set to the backend base (e.g. https://api.example.com)
*/

import { NextResponse, type NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

function buildTargetUrl(pathSegments: string[], searchParameters: URLSearchParams): string {
  if (!BACKEND_URL) throw new Error("BACKEND_URL env variable is not set");
  const base = BACKEND_URL.replace(/\/$/, "");
  const path = "/" + pathSegments.join("/");
  const query = searchParameters.toString();
  return query ? `${base}${path}?${query}` : `${base}${path}`;
}

function filterHeadersForUpstream(request: NextRequest): Headers {
  const upstreamHeaders = new Headers();
  for (const [key, value] of request.headers.entries()) {
    // Drop headers that commonly break proxies or are hop-by-hop
    if (
      [
        "host",
        "origin",
        "referer",
        "connection",
        "keep-alive",
        "proxy-authenticate",
        "proxy-authorization",
        "te",
        "trailers",
        "transfer-encoding",
        "upgrade",
      ].includes(key.toLowerCase())
    ) {
      continue;
    }
    upstreamHeaders.set(key, value);
  }
  // Set a predictable Origin if backend requires one (optional):
  // upstreamHeaders.set('Origin', BACKEND_URL);
  return upstreamHeaders;
}

async function forward(request: NextRequest, context: { params: { path: string[] } }) {
  const { path } = context.params;
  const targetUrl = buildTargetUrl(path, request.nextUrl.searchParams);

  const method = request.method;
  const headers = filterHeadersForUpstream(request);

  // Read body for non-GET/HEAD
  let body: BodyInit | undefined;
  if (method !== "GET" && method !== "HEAD") {
    // Clone the request and read the body as ArrayBuffer for binary-safety
    const arrayBuffer = await request.arrayBuffer();
    body = arrayBuffer;
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(targetUrl, {
      method,
      headers,
      body,
      // Include cookies if your backend needs session (adjust as required):
      credentials: "include",
      // If backend has self-signed certs in dev you might need `next dev` flags; we keep defaults.
    });
  } catch (error: any) {
    const message = error?.message || "Upstream fetch failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // Build response: stream body and pass through status + headers.
  const resourcesHeaders = new Headers(upstreamResponse.headers);

  // Set permissive CORS for the browser on our own origin (safe because this is our API route)
  resourcesHeaders.set("Access-Control-Allow-Origin", "*");
  resourcesHeaders.set("Access-Control-Allow-Credentials", "true");
  resourcesHeaders.set("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS");
  resourcesHeaders.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, X-Session, Accept, Origin",
  );

  // For OPTIONS preflight, reply immediately
  if (method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: resourcesHeaders });
  }

  // Stream upstream body to client
  const bodyStream = upstreamResponse.body;
  return new NextResponse(bodyStream, {
    status: upstreamResponse.status,
    headers: resourcesHeaders,
  });
}

export {
  forward as GET,
  forward as POST,
  forward as PUT,
  forward as PATCH,
  forward as DELETE,
  forward as OPTIONS,
  forward as HEAD,
};
