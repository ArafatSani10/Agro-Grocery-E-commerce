import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  // future token add
  return config;
});

api.interceptors.response.use(
  (res) => res.data, // 👈 important
  (error) => Promise.reject(error)
);

export default api;