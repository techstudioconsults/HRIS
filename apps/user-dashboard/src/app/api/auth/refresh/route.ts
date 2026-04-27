import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  COOKIE_SESSION_META,
} from '@/lib/session/cookie-names';
import { verifyMeta, signMeta } from '@/lib/session/session-manager';
import type { SessionMeta } from '@/lib/session/types';

const IS_PROD = process.env.NODE_ENV === 'production';

const BASE_COOKIE = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: 'strict' as const,
  path: '/',
};

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
 * POST /api/auth/refresh
 * Reads __hris_rt cookie, calls the backend /auth/refresh endpoint,
 * rotates all three session cookies on success.
 */
export async function POST() {
  const secret = process.env.AUTH_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!secret || !baseUrl) {
    return NextResponse.json({ error: 'misconfigured' }, { status: 500 });
  }

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(COOKIE_REFRESH_TOKEN)?.value;
  const metaCookie = cookieStore.get(COOKIE_SESSION_META)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'session_expired' }, { status: 401 });
  }

  const currentMeta = metaCookie ? await verifyMeta(metaCookie, secret) : null;

  let backendRes: Response;
  try {
    backendRes = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    return NextResponse.json({ error: 'session_expired' }, { status: 401 });
  }

  if (!backendRes.ok) {
    return NextResponse.json({ error: 'session_expired' }, { status: 401 });
  }

  const data = await backendRes.json();
  const newAccessToken: string = data?.data?.accessToken;
  const newRefreshToken: string = data?.data?.refreshToken;

  if (!data.success || !newAccessToken || !newRefreshToken) {
    return NextResponse.json({ error: 'session_expired' }, { status: 401 });
  }

  const expMs = jwtExpMs(newAccessToken);
  const expSec = Math.floor(expMs / 1000);
  const maxAge = Math.max(0, Math.floor((expMs - Date.now()) / 1000));

  const newMeta: SessionMeta = {
    id: currentMeta?.id ?? '',
    fullName: currentMeta?.fullName ?? '',
    email: currentMeta?.email ?? '',
    role: currentMeta?.role ?? { id: '', name: '' },
    permissions: currentMeta?.permissions ?? [],
    exp: expSec,
  };

  const signedMeta = await signMeta(newMeta, secret);
  const response = NextResponse.json({
    accessToken: newAccessToken,
    expiresAt: expMs,
  });

  response.cookies.set(COOKIE_ACCESS_TOKEN, newAccessToken, {
    ...BASE_COOKIE,
    maxAge,
  });

  response.cookies.set(COOKIE_REFRESH_TOKEN, newRefreshToken, {
    ...BASE_COOKIE,
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60,
  });

  response.cookies.set(COOKIE_SESSION_META, signedMeta, {
    ...BASE_COOKIE,
    maxAge,
  });

  return response;
}
