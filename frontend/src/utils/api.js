import axios from "axios";

// 🔥 FIX: Check both common env keys, fallback cleanly to production Render node URL
const BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  import.meta.env.VITE_API_URL || 
  "https://perfect-moto.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Interceptor 1: Inject access token into every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor 2: Silent token refresh on 401 — with 429 loop protection
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🛑 STOP: If rate limited (429) or this is already a refresh request, bail out immediately
    if (
      error.response?.status === 429 ||
      originalRequest?.url?.includes("/auth/refresh")
    ) {
      localStorage.removeItem("token");
      return Promise.reject(error);
    }

    // Handle 401 — try silent refresh once only
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 🔥 FIX: Swapped hardcoded string with clean dynamic BASE_URL variable trace
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { token } = res.data;
        localStorage.setItem("token", token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);

      } catch (refreshError) {
        localStorage.removeItem("token");
        // Only redirect if not already on login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;