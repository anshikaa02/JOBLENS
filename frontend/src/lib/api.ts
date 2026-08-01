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
