import axios from "axios";

function normalizeApiBaseURL(url?: string) {
  if (!url) {
    return "http://localhost:5000/api";
  }

  const trimmed = url.trim().replace(/\/+$/, "");

  try {
    const parsed = new URL(trimmed);
    const pathname = parsed.pathname.replace(/\/+$/, "");

    parsed.pathname =
      !pathname || pathname === "/" ? "/api" : pathname.endsWith("/api") ? pathname : `${pathname}/api`;

    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }
}

const baseURL = normalizeApiBaseURL(import.meta.env.VITE_API_URL);

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
