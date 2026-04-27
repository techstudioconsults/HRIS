import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_SESSION_META,
} from '@/lib/session/cookie-names';
import { verifyMeta } from '@/lib/session/session-manager';

function jwtExpMs(token: string): number {
  try {
    const segment = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = (4 - (segment.length % 4)) % 4;
    const json = atob(segment + '='.repeat(pad));
    const { exp } = JSON.parse(json) as { exp: number };
    return exp * 1000;
  } catch {
    return Date.now() + 60 * 60 * 1000;
  }
}

/**
 * GET /api/auth/token
 * Reads __hris_at + __hris_meta cookies and returns the access token with
 * session user data for the client-side TokenManager and SessionProvider.
 */
export async function GET() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'misconfigured' }, { status: 500 });
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;
  const metaCookie = cookieStore.get(COOKIE_SESSION_META)?.value;

  if (!accessToken || !metaCookie) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  const session = await verifyMeta(metaCookie, secret);
  if (!session) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  const expiresAt = jwtExpMs(accessToken);

  return NextResponse.json({
    accessToken,
    expiresAt,
    user: {
      id: session.id,
      employee: {
        id: session.id,
        fullName: session.fullName,
        email: session.email,
        role: session.role,
      },
      role: session.role,
      permissions: session.permissions,
    },
    expires: new Date(session.exp * 1000).toISOString(),
  });
}
