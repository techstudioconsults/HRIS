export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseData {
  user: User;
  tokens: Tokens;
}

export interface UserResponse {
  success: boolean;
  data: AuthResponseData;
  error?: string;
}

// ── Auth store state & actions ────────────────────────────────────────────────

export interface AuthState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any | null;
  isAuthenticated: boolean;
  sessionExpiry: Date | null;
}

export interface AuthActions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUser: (user: any | null) => void;
  clearUser: () => void;
  logout: () => void;
  setSessionExpiry: (expiry: Date | null) => void;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface OTPInputProperties {
  value: string;
  onChange: (value: string) => void;
}
