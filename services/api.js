import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    // ngrok free tier serves an HTML warning page to browser requests unless
    // this header is present. Without it, axios receives HTML instead of JSON.
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// All BE endpoints return Result<T> = { data, resultStatus, messages }.
// HTTP status alone is not authoritative — DELETE returns 200 with
// resultStatus="NotFound", toggle-favourite returns 400 with a message
// when the 3-favourite limit is exceeded. Always read resultStatus from body.
export class ApiError extends Error {
  constructor(message, { resultStatus, messages, status } = {}) {
    super(message);
    this.name = "ApiError";
    this.resultStatus = resultStatus;
    this.messages = messages ?? [];
    this.status = status;
  }
}

// On 4xx/5xx, BE may still return the Result envelope. Convert to ApiError so
// callers can read `error.messages` / `error.resultStatus` uniformly.
// Also: on 401 from a /management page, clear the token cookie and redirect
// to login so a stale/expired JWT can't keep showing a half-broken admin UI.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && typeof window !== "undefined") {
      Cookies.remove("token");
      if (window.location.pathname.startsWith("/management") &&
          window.location.pathname !== "/management/login") {
        window.location.href = "/management/login";
      }
    }
    const data = error?.response?.data;
    if (data && typeof data === "object" && "resultStatus" in data) {
      return Promise.reject(
        new ApiError(data.messages?.[0] ?? data.resultStatus ?? error.message, {
          resultStatus: data.resultStatus,
          messages: data.messages,
          status,
        })
      );
    }
    return Promise.reject(error);
  }
);

export default api;

export const unwrap = (envelope) => {
  if (!envelope || typeof envelope !== "object" || !("resultStatus" in envelope)) {
    return envelope;
  }
  if (envelope.resultStatus === "Success") return envelope.data;
  throw new ApiError(envelope.messages?.[0] ?? envelope.resultStatus ?? "Request failed", {
    resultStatus: envelope.resultStatus,
    messages: envelope.messages,
  });
};
