import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? window.cookieStore.get("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config;
    const suppressErrorToast = !!config?.suppressErrorToast;

    if (suppressErrorToast) {
      return Promise.reject(error);
    }

    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        window.cookieStore.delete("token");
        alert("Session expired. Please login again.");
      } else if (error.response?.status === 403) {
        alert("You do not have permission to perform this action.");
      } else if (error.response?.status === 404) {
        alert("Resource not found.");
      } else if (error.response?.status === 500) {
        alert("Server error. Please try again later.");
      } else if (error.code === "ECONNABORTED") {
        alert("Request timeout. Please try again.");
      } else if (!error.response) {
        alert("Network error. Please check your connection.");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
