import axios from "axios";

/**
 * baseURL is "/api" — Vite's dev server proxies /api/* to the FastAPI
 * backend at http://localhost:8000 (see vite.config.ts). In production
 * (Phase 12), this gets replaced by the real deployed backend URL via an
 * environment variable.
 */
export const api = axios.create({
  baseURL: "/api",
});

const AUTH_STORAGE_KEY = "joblens_auth";

/**
 * Request interceptor — attaches the stored JWT to every outgoing request
 * automatically, so individual pages never have to remember to pass an
 * Authorization header themselves. Reads directly from localStorage
 * (rather than React state) because this file has no access to React
 * context — auth-context.tsx and this interceptor share the same storage
 * key as their point of agreement.
 */
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (stored) {
    try {
      const { token } = JSON.parse(stored) as { token?: string };
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Malformed storage — ignore and send the request unauthenticated;
      // the backend will correctly reject it with 401 if auth was required.
    }
  }
  return config;
});

/** Shared helper for extracting a readable message from a failed API call. */
export function extractErrorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (err.code === "ERR_NETWORK") {
      return "Couldn't reach the server. Is the FastAPI backend running on port 8000?";
    }
  }
  return fallback;
}
