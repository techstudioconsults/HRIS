import { HttpAdapter } from "@/lib/http/http-adapter";

interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export class AppService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getAllProducts() {
    const response = await this.http.get<ProductResponse>("/products");
    if (response?.status === 200) {
      return response.data;
    }
  }

  private buildQueryParameters(filters: IFilters): string {
    const queryParameters = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined) {
        queryParameters.append(key, value.toString());
      }
    }
    return queryParameters.toString();
  }
}
