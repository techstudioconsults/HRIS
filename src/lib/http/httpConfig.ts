import axios from "axios";

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

// Add request interceptor to add auth token and ensure CSRF is initialized
http.interceptors.request.use(
  async (config) => {
    // await initializeCsrf();
    // const xsrfToken = getCsrfToken();
    // const session = await getSession();
    // if (session?.user.token) {
    //   config.headers.Authorization = `Bearer ${session.user.token}`;
    // }

    // if (xsrfToken) {
    //   config.headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default http;
