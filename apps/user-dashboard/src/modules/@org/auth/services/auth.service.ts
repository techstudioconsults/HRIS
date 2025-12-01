import { HttpAdapter } from "@/lib/http/http-adapter";
import { ForgotPasswordData, LoginOTPFFormData, RegisterFormData, ResetPasswordData } from "@/schemas";

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
    const response = await this.http.post<{ data: string; success: boolean }>(`/auth/onboard`, data);
    if (response?.status === 201) {
      return response.data;
    }
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
    const response = await this.http.post<{ data: string }>("/auth/forgotpassword", credentials);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async resetPassword(credentials: ResetPasswordData) {
    const response = await this.http.post<{ data: string }>("/auth/resetpassword", credentials);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async handleGoogleCallback(credentials: { code: string }) {
    const response = await this.http.get<UserResponse>(`/auth/oauth/google/callback?code=${credentials.code}`);
    if (response?.status === 200) {
      return response.data;
    }
  }
}
