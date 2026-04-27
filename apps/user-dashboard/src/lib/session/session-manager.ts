/**
 * Session metadata signing / verification using Web Crypto HMAC-SHA256.
 * Uses only globalThis.crypto — compatible with both Edge (middleware) and Node runtimes.
 */

import type { SessionMeta } from './types';

const encoder = new TextEncoder();

async function importKey(secret: string): Promise<CryptoKey> {
  return globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function bufferToBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlToBuffer(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = (4 - (padded.length % 4)) % 4;
  const binary = atob(padded + '='.repeat(pad));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Sign a SessionMeta payload. Returns `<base64url-payload>.<base64url-signature>`.
 */
export async function signMeta(
  payload: SessionMeta,
  secret: string
): Promise<string> {
  const encoded = bufferToBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await importKey(secret);
  const sig = await globalThis.crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(encoded).buffer as ArrayBuffer
  );
  return `${encoded}.${bufferToBase64Url(sig)}`;
}

/**
 * Verify and decode a signed cookie value.
 * Returns the payload if valid and not expired; null otherwise.
 */
export async function verifyMeta(
  cookie: string,
  secret: string
): Promise<SessionMeta | null> {
  const dotIndex = cookie.lastIndexOf('.');
  if (dotIndex === -1) return null;

  const encoded = cookie.slice(0, dotIndex);
  const sig = cookie.slice(dotIndex + 1);

  const key = await importKey(secret);
  const valid = await globalThis.crypto.subtle.verify(
    'HMAC',
    key,
    base64UrlToBuffer(sig).buffer as ArrayBuffer,
    encoder.encode(encoded).buffer as ArrayBuffer
  );

  if (!valid) return null;

  let payload: SessionMeta;
  try {
    const json = new TextDecoder().decode(base64UrlToBuffer(encoded));
    payload = JSON.parse(json) as SessionMeta;
  } catch {
    return null;
  }

  // Check expiry (exp is Unix seconds)
  if (Math.floor(Date.now() / 1000) > payload.exp) return null;

  return payload;
}
