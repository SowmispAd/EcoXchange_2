import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const baseURL = envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith("/api/")) {
    config.url = config.url.replace("/api/", "/");
  }

  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("ecoxchange-auth-v2"); // Zahn/Zustand storage key
      }
      
      useAuthStore.getState().logout();
      
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
