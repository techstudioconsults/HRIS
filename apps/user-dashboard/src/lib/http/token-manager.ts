/**
 * Token Manager - Efficient JWT token caching and management
 *
 * This manager caches the access token in memory and only fetches
 * a new session when the token is expired or missing, dramatically
 * reducing the number of session requests.
 */

import { getSession } from "next-auth/react";

interface CachedToken {
  accessToken: string;
  expiresAt: number; // timestamp in milliseconds
}

class TokenManager {
  private cache: CachedToken | null = null;
  private pendingRequest: Promise<string | null> | null = null;
  private readonly REFRESH_BUFFER = 5 * 60 * 1000; // 5 minutes before expiry

  /**
   * Get the current access token, fetching a new one if necessary
   */
  async getAccessToken(): Promise<string | null> {
    // If we have a valid cached token, return it
    if (this.cache && this.isTokenValid()) {
      return this.cache.accessToken;
    }

    // If there's already a pending request, wait for it
    if (this.pendingRequest) {
      return this.pendingRequest;
    }

    // Fetch a new token
    this.pendingRequest = this.fetchNewToken();

    try {
      const token = await this.pendingRequest;
      return token;
    } finally {
      this.pendingRequest = null;
    }
  }

  /**
   * Check if the cached token is still valid
   */
  private isTokenValid(): boolean {
    if (!this.cache) return false;
    const now = Date.now();
    return now < this.cache.expiresAt - this.REFRESH_BUFFER;
  }

  /**
   * Fetch a new token from the session
   */
  private async fetchNewToken(): Promise<string | null> {
    try {
      const session = await getSession();

      if (!session?.tokens?.accessToken) {
        this.cache = null;
        return null;
      }

      // Cache the token with expiry time
      // NextAuth session maxAge is 24 hours by default
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      this.cache = {
        accessToken: session.tokens.accessToken,
        expiresAt,
      };

      return this.cache.accessToken;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("TokenManager: Failed to fetch session", error);
      this.cache = null;
      return null;
    }
  }

  /**
   * Refresh the access token using the refresh token
   * Calls backend directly without going through Next.js API route
   */
  async refreshAccessToken(): Promise<string | null> {
    try {
      // Get the current session to access the refresh token
      const session = await getSession();

      if (!session?.tokens?.refreshToken) {
        // eslint-disable-next-line no-console
        console.error("TokenManager: No refresh token available");
        this.invalidate();
        return null;
      }

      // Call backend refresh endpoint directly
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: session.tokens.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data?.tokens?.accessToken) {
        // Update the cache with new token
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        this.cache = {
          accessToken: data.data.tokens.accessToken,
          expiresAt,
        };

        return this.cache.accessToken;
      }

      return null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("TokenManager: Failed to refresh token", error);
      this.invalidate();
      return null;
    }
  }

  /**
   * Invalidate the cached token (useful for logout or token refresh)
   */
  invalidate(): void {
    this.cache = null;
    this.pendingRequest = null;
  }

  /**
   * Manually set a token (useful for testing or manual token management)
   */
  setToken(accessToken: string, expiresAt: number): void {
    this.cache = { accessToken, expiresAt };
  }
}

// Singleton instance
export const tokenManager = new TokenManager();
