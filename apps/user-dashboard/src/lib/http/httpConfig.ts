import axios from 'axios';

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

// Add response interceptor to handle authorization failures.
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      tokenManager.invalidate();
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export default http;
