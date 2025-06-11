import { HttpAdapter } from "@/lib/http/http-adapter";
import { LoginOTPFormData, RegisterFormData } from "@/schemas";

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

  async loginWithOTP(data: LoginOTPFormData) {
    const response = await this.http.post<{ data: string; success: boolean }>(`auth/login/requestotp`, data);
    if (response?.status === 200) {
      return response.data;
    }
  }
}
