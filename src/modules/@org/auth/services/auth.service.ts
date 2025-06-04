import { HttpAdapter } from "@/lib/http/http-adapter";
import { RegisterFormData } from "@/schemas";

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
}
