import { HttpAdapter } from "@/lib/http/http-adapter";
import { ForgotPasswordData, LoginOTPFFormData, RegisterFormData, ResetPasswordData } from "@/schemas";

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

  async loginWithOTP(data: LoginOTPFFormData) {
    const response = await this.http.post<{ data: string; success: boolean }>(`auth/login/requestotp`, data);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async forgotPassword(data: ForgotPasswordData) {
    const response = await this.http.post<{ data: string; success: boolean }>(`/auth/forgotpassword`, data);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async resetPassword(data: ResetPasswordData) {
    const response = await this.http.post<{ data: string; success: boolean }>(`/auth/resetpassword`, data);
    if (response?.status === 200) {
      return response.data;
    }
  }
}
