import { type CachedToken } from './types';

/**
 * Token Manager — in-memory JWT access token cache.
 *
 * Reads the access token from the BFF Route Handler (GET /api/auth/token),
 * which reads the HTTP-only __hris_at cookie server-side.
 * The token is never stored in localStorage or accessible to third-party scripts.
 */
class TokenManager {
  private cache: CachedToken | null = null;
  private pendingRequest: Promise<string | null> | null = null;
  private readonly REFRESH_BUFFER = 5 * 60 * 1000; // refresh 5 min before expiry

  async getAccessToken(): Promise<string | null> {
    if (this.cache && this.isTokenValid()) return this.cache.accessToken;
    if (this.pendingRequest) return this.pendingRequest;

    this.pendingRequest = this.fetchNewToken();
    try {
      return await this.pendingRequest;
    } finally {
      this.pendingRequest = null;
    }
  }

  private isTokenValid(): boolean {
    if (!this.cache) return false;
    return Date.now() < this.cache.expiresAt - this.REFRESH_BUFFER;
  }

  private async fetchNewToken(): Promise<string | null> {
    try {
      const res = await fetch('/api/auth/token', { cache: 'no-store' });
      if (!res.ok) {
        this.cache = null;
        return null;
      }
      const data = await res.json();
      if (!data.accessToken) {
        this.cache = null;
        return null;
      }
      this.cache = { accessToken: data.accessToken, expiresAt: data.expiresAt };
      return this.cache.accessToken;
    } catch {
      this.cache = null;
      return null;
    }
  }

  async refreshAccessToken(): Promise<string | null> {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        cache: 'no-store',
      });
      if (!res.ok) {
        this.invalidate();
        return null;
      }
      const data = await res.json();
      if (!data.accessToken) {
        this.invalidate();
        return null;
      }
      this.cache = { accessToken: data.accessToken, expiresAt: data.expiresAt };
      return this.cache.accessToken;
    } catch {
      this.invalidate();
      return null;
    }
  }

  invalidate(): void {
    this.cache = null;
    this.pendingRequest = null;
  }

  setToken(accessToken: string, expiresAt: number): void {
    this.cache = { accessToken, expiresAt };
  }
}

export const tokenManager = new TokenManager();
