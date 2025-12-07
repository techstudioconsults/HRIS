import http from "@/lib/http/httpConfig";

export class HttpAdapter {
  private buildQueryString(query: QueryParameters): string {
    if (Object.keys(query).length === 0) return "";

    return Object.entries(query)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join("&");
  }

  private async handleRequest<T>(
    requestFunction: () => Promise<{ data: T; status: number }>,
  ): Promise<HttpResponse<T> | undefined> {
    const result = await (async () => {
      const response = await requestFunction();
      return {
        data: response.data,
        status: response.status,
      };
    })();
    return result;
  }

  async get<T>(
    endpoint: string,
    query: QueryParameters = {},
    headers?: HttpHeaders,
  ): Promise<HttpResponse<T> | undefined> {
    const queryString = this.buildQueryString(query);
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.handleRequest<T>(() => http.get(url, { headers }));
  }

  async post<T>(url: string, data: unknown, headers?: HttpHeaders): Promise<HttpResponse<T> | undefined> {
    return this.handleRequest<T>(() => http.post(url, data, { headers }));
  }

  async patch<T>(url: string, data?: unknown, headers?: HttpHeaders): Promise<HttpResponse<T> | undefined> {
    return this.handleRequest<T>(() => http.patch(url, data, { headers }));
  }

  async put<T>(url: string, data?: unknown, headers?: HttpHeaders): Promise<HttpResponse<T> | undefined> {
    return this.handleRequest<T>(() => http.put(url, data, { headers }));
  }

  async delete<T>(url: string, data?: unknown, headers?: HttpHeaders): Promise<HttpResponse<T> | undefined> {
    return this.handleRequest<T>(() => http.delete(url, { data, headers }));
  }
}
