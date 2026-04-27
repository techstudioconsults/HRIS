import { NextRequest, NextResponse } from 'next/server';

import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  COOKIE_SESSION_META,
} from '@/lib/session/cookie-names';
import { signMeta } from '@/lib/session/session-manager';
import type { SessionMeta, SetSessionBody } from '@/lib/session/types';

const IS_PROD = process.env.NODE_ENV === 'production';

const BASE_COOKIE = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: 'strict' as const,
  path: '/',
};

/** Decode exp from a JWT without verifying the signature. */
function jwtExpMs(token: string): number {
  try {
    const segment = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = (4 - (segment.length % 4)) % 4;
    const json = atob(segment + '='.repeat(pad));
    const { exp } = JSON.parse(json) as { exp: number };
    return exp * 1000;
  } catch {
    return Date.now() + 60 * 60 * 1000; // 1 hr default
  }
}

/**
 * POST /api/auth/session
 * Called by auth views after a successful login.
 * Sets __hris_at, __hris_rt, __hris_meta as HTTP-only cookies.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'misconfigured' }, { status: 500 });
  }

  const body: SetSessionBody = await request.json();
  const { employee, tokens, permissions } = body;

  const expMs = jwtExpMs(tokens.accessToken);
  const expSec = Math.floor(expMs / 1000);
  const maxAge = Math.max(0, Math.floor((expMs - Date.now()) / 1000));

  const meta: SessionMeta = {
    id: employee.id,
    fullName: employee.fullName,
    email: employee.email,
    role: employee.role,
    permissions,
    exp: expSec,
  };

  const signedMeta = await signMeta(meta, secret);
  const response = NextResponse.json({ ok: true });

  response.cookies.set(COOKIE_ACCESS_TOKEN, tokens.accessToken, {
    ...BASE_COOKIE,
    maxAge,
  });

  response.cookies.set(COOKIE_REFRESH_TOKEN, tokens.refreshToken, {
    ...BASE_COOKIE,
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  response.cookies.set(COOKIE_SESSION_META, signedMeta, {
    ...BASE_COOKIE,
    maxAge,
  });

  return response;
}

/**
 * DELETE /api/auth/session
 * Logout — clears all three session cookies.
 */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(COOKIE_ACCESS_TOKEN, '', { maxAge: 0, path: '/' });
  response.cookies.set(COOKIE_REFRESH_TOKEN, '', {
    maxAge: 0,
    path: '/api/auth',
  });
  response.cookies.set(COOKIE_SESSION_META, '', { maxAge: 0, path: '/' });

  return response;
}
