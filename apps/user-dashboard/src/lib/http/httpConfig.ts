import axios, { InternalAxiosRequestConfig } from 'axios';
import { signOut } from 'next-auth/react';

import { tokenManager } from './token-manager';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
const TIMEOUTMSG = 'Waiting for too long...Aborted!';

// Axios instance configuration
const config = {
  baseURL: BASE_URL,
  timeoutErrorMessage: TIMEOUTMSG,
  headers: {
    'Content-Type': 'application/json',
  },
};

const http = axios.create(config);

const redirectToLogin = () => {
  if (typeof window === 'undefined') {
    return;
  }

  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
};

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
  }
);

// Response interceptor — handle 401 with token refresh, then sign-out fallback.
// signOut({ redirect: false }) clears the NextAuth cookie so the proxy allows
// the /login redirect instead of bouncing the user back to the dashboard.
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

      // Refresh failed — clear session cookie so the proxy stops treating
      // this user as authenticated, then navigate to login.
      tokenManager.invalidate();
      await signOut({ redirect: false });
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export default http;
