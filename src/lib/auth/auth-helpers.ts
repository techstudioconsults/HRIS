/**
 * Authentication Helper Functions
 *
 * Provides utilities for managing authentication state and token cache
 */

import { signOut } from "next-auth/react";

import { tokenManager } from "../http/token-manager";

/**
 * Sign out the user and clear all cached tokens
 */
export async function signOutAndClearCache(): Promise<void> {
  // Invalidate the token cache first
  tokenManager.invalidate();

  // Then sign out
  await signOut({ redirect: true, callbackUrl: "/login" });
}

/**
 * Invalidate token cache (useful when token is manually refreshed)
 */
export function invalidateTokenCache(): void {
  tokenManager.invalidate();
}
