import axios from "axios";
import { API_BASE_URL, AUTH_STORAGE_KEY } from "@/shared/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/** 로그인/로그아웃 시 호출해 Authorization 헤더를 즉시 반영 */
export function setAuthToken(token: string | null): void {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if ((status === 401 || status === 403) && typeof window !== "undefined") {
      setAuthToken(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
