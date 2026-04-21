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

export type { AuthActions, AuthState } from '../stores/auth-store';
