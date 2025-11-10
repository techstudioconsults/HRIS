import { HttpAdapter } from "@/lib/http/http-adapter";
import { tryCatchWrapper } from "@/lib/tools/tryCatchFunction";
import { ForgotPasswordData, LoginOTPFFormData, RegisterFormData, ResetPasswordData } from "@/schemas";
import { isAxiosError } from "axios";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponseData {
  user: User;
  tokens: Tokens;
}

interface UserResponse {
  success: boolean;
  data: AuthResponseData;
  error?: string; // Optional error field for error cases
}

export class AuthService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async signUp(data: RegisterFormData) {
    return tryCatchWrapper(async () => {
      const response = await this.http.post<{ data: string; success: boolean }>(`/auth/onboard`, data);
      if (response?.status === 201) {
        return response.data;
      }
      throw new Error("Unexpected response status");
    });
  }

  async requestOTP(data: LoginOTPFFormData) {
    const response = await this.http.post<{ data: string; success: boolean }>(`/auth/login/requestotp`, data);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async loginWithOTP(data: LoginOTPFFormData) {
    const response = await this.http.post<AuthResponse>(`/auth/login/otp`, data);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async forgotPassword(credentials: ForgotPasswordData) {
    return tryCatchWrapper(
      async () => {
        const response = await this.http.post<{ data: string }>("/auth/forgotpassword", credentials);
        if (response?.status === 200) {
          return response.data;
        }
        throw new Error("Password reset request failed");
      },
      (error: unknown) => {
        if (isAxiosError(error)) {
          return new Error(error.response?.data?.message || "Password reset request failed");
        }
        return new Error("Unknown error during password reset");
      },
    );
  }

  async resetPassword(credentials: ResetPasswordData) {
    return tryCatchWrapper(
      async () => {
        const response = await this.http.post<{ data: string }>("/auth/resetpassword", credentials);
        if (response?.status === 200) {
          return response.data;
        }
        throw new Error("Password reset failed");
      },
      (error: unknown) => {
        if (isAxiosError(error)) {
          return new Error(error.response?.data?.message || "Password reset failed");
        }
        return new Error("Unknown error during password reset");
      },
    );
  }

  async handleGoogleCallback(credentials: { code: string }) {
    return tryCatchWrapper(
      async () => {
        const response = await this.http.get<UserResponse>(`/auth/oauth/google/callback?code=${credentials.code}`);
        if (response?.status === 200) {
          return response.data;
        }
        throw new Error("Failed to handle Google callback");
      },
      (error: unknown) => {
        if (isAxiosError(error)) {
          return new Error("Authentication failed");
        }
        return new Error("Unknown error during authentication");
      },
    );
  }
}
