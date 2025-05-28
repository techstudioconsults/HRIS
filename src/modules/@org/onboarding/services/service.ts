import http from "@/lib/http/httpConfig";

export const AuthService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await http.post("/auth/login", credentials);
    return response.data;
  },

  logout: async () => {
    await http.post("/auth/logout");
  },

  getCurrentUser: async () => {
    const response = await http.get("/auth/me");
    return response.data;
  },
};
