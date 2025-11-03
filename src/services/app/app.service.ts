import { HttpAdapter } from "@/lib/http/http-adapter";

export class AppService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getAllProducts(employeeID: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await this.http.get<any>(`/notifications/users/${employeeID}`);
    if (response?.status === 200) {
      return response.data;
    }
  }
}
