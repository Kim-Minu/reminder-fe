import axios from "axios";
import { API_BASE_URL, AUTH_STORAGE_KEY } from "@/shared/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/** refresh 전용 인스턴스 — 인터셉터 없이 순수 호출 */
const refreshApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── 외부에서 주입받는 콜백 ───────────────────────────────────────
let _getRefreshToken: (() => string | null) | null = null;
let _onTokensUpdated: ((accessToken: string, refreshToken: string) => void) | null = null;
let _onLogout: (() => void) | null = null;

/**
 * authStore에서 호출해 refresh 핸들러를 등록한다.
 * api.ts → authStore 직접 import를 피하기 위한 콜백 패턴.
 */
export function registerAuthHandlers(
  getRefreshToken: () => string | null,
  onTokensUpdated: (accessToken: string, refreshToken: string) => void,
  onLogout: () => void,
): void {
  _getRefreshToken = getRefreshToken;
  _onTokensUpdated = onTokensUpdated;
  _onLogout = onLogout;
}

// ─── Authorization 헤더 관리 ──────────────────────────────────────
if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const { state } = JSON.parse(stored);
      if (state?.accessToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${state.accessToken}`;
      }
    }
  } catch {}
}

export function setAuthToken(token: string | null): void {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// ─── Refresh 큐 ───────────────────────────────────────────────────
let isRefreshing = false;
type QueueItem = { resolve: (token: string) => void; reject: (err: unknown) => void };
let failedQueue: QueueItem[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((item) => {
    if (error) item.reject(error);
    else item.resolve(token!);
  });
  failedQueue = [];
}

// ─── Response 인터셉터 ────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = _getRefreshToken?.();
    if (!refreshToken) {
      _onLogout?.();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newAccessToken) => {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await refreshApi.post<{ accessToken: string; refreshToken: string }>(
        "/api/auth/refresh",
        { refreshToken },
      );

      setAuthToken(data.accessToken);
      _onTokensUpdated?.(data.accessToken, data.refreshToken);

      processQueue(null, data.accessToken);
      originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      _onLogout?.();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
