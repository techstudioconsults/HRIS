import axios, { type InternalAxiosRequestConfig } from 'axios';

import { tokenManager } from './token-manager';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

const http = axios.create({
  baseURL: BASE_URL,
  timeoutErrorMessage: 'Waiting for too long...Aborted!',
  headers: { 'Content-Type': 'application/json' },
});

const redirectToLogin = () => {
  if (typeof window === 'undefined') return;
  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
};

http.interceptors.request.use(
  async (config) => {
    const accessToken = await tokenManager.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor — on 401, attempt a token refresh via the BFF Route Handler.
 * If the refresh also fails, clear the session cookies and redirect to /login.
 * The _retried guard prevents infinite retry loops.
 */
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retried?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retried) {
      originalRequest._retried = true;

      const newToken = await tokenManager.refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return http(originalRequest);
      }

      // Refresh failed — clear server-side cookies then navigate to login
      tokenManager.invalidate();
      await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {});
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export default http;
