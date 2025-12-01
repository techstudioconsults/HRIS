import axios from "axios";

import { tokenManager } from "./token-manager";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
const TIMEOUTMSG = "Waiting for too long...Aborted!";

// Axios instance configuration
const config = {
  baseURL: BASE_URL,
  timeoutErrorMessage: TIMEOUTMSG,
  headers: {
    "Content-Type": "application/json",
  },
};

const http = axios.create(config);

// Add request interceptor to add auth token
http.interceptors.request.use(
  async (config) => {
    // Get cached or fresh access token
    const accessToken = await tokenManager.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor to handle 401 errors and token refresh
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 and haven't already retried, try to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the access token
        const newAccessToken = await tokenManager.refreshAccessToken();

        if (newAccessToken) {
          // Update the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          // Retry the original request
          return http(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, invalidate cache and redirect to login
        tokenManager.invalidate();
        // Optionally redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw refreshError;
      }
    }

    // For other errors or if refresh failed, invalidate the token cache
    if (error.response?.status === 401) {
      tokenManager.invalidate();
    }

    throw error;
  },
);

export default http;
