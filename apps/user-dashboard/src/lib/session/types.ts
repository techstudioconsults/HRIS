import type { Employee, AuthTokens, Role } from '@/lib/auth-types';

/** Stored in __hris_meta cookie — HMAC-SHA256 signed */
export interface SessionMeta {
  id: string;
  fullName: string;
  email: string;
  role: { id: string; name: string };
  permissions: string[];
  exp: number; // Unix seconds
}

/**
 * Mirrors the NextAuth Session shape exactly so all 17 useSession() consumers
 * require only an import-path change — no logic changes.
 */
export interface HrisSession {
  user: {
    id: string;
    employee: Employee;
    role: Role;
    permissions: string[];
  };
  tokens: Pick<AuthTokens, 'accessToken'>;
  expires: string;
}

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface UseSessionReturn {
  data: HrisSession | null;
  status: SessionStatus;
  /** Re-fetches /api/auth/token and updates the context. Call after setting session cookies. */
  refresh: () => Promise<void>;
}

/** Body sent to POST /api/auth/session after a successful login */
export interface SetSessionBody {
  employee: {
    id: string;
    fullName: string;
    email: string;
    role: { id: string; name: string };
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  permissions: string[];
}

/** Response from GET /api/auth/token */
export interface TokenResponse {
  accessToken: string;
  expiresAt: number;
  user: HrisSession['user'];
  expires: string;
}
