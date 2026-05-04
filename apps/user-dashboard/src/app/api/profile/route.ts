import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { COOKIE_SESSION_META } from '@/lib/session/cookie-names';
import { verifyMeta } from '@/lib/session/session-manager';

/**
 * GET /api/profile
 * Returns the current authenticated user's profile from the signed session cookie.
 * No employee ID required — identity is derived from __hris_meta.
 */
export async function GET() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.json(
      { status: 'error', message: 'Server misconfigured' },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  const metaCookie = cookieStore.get(COOKIE_SESSION_META)?.value;

  if (!metaCookie) {
    return NextResponse.json(
      { status: 'error', message: 'Unauthenticated' },
      { status: 401 }
    );
  }

  const session = await verifyMeta(metaCookie, secret);
  if (!session) {
    return NextResponse.json(
      { status: 'error', message: 'Invalid or expired session' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    status: 'success',
    data: {
      id: session.id,
      fullName: session.fullName,
      email: session.email,
      role: session.role,
      permissions: session.permissions,
    },
    timestamp: new Date().toISOString(),
  });
}
