import axios from "axios";

import { tokenManager } from "./token-manager";

// import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

// const CSRF_URL = `${BASE_URL}/sanctum/csrf-cookie`;
const TIMEOUTMSG = "Waiting for too long...Aborted!";

// Axios instance configuration
const config = {
  baseURL: BASE_URL,
  timeoutErrorMessage: TIMEOUTMSG,
  // withCredentials: true,
  // withXSRFToken: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const http = axios.create(config);

// Function to fetch CSRF token from cookies
// export const getCsrfToken = () => {
//   return Cookies.get("XSRF-TOKEN");
// };

// Function to initialize CSRF token
// const initializeCsrf = async () => {
//   try {
//     await axios.get(CSRF_URL, { withCredentials: true });
//   } catch (error) {
//     console.error("CSRF initialization failed:", error);
//   }
// };

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

// Add response interceptor to handle 401 errors
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If we get a 401, invalidate the token cache
    if (error.response?.status === 401) {
      tokenManager.invalidate();
    }
    throw error;
  },
);

export default http;
