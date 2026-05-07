import api from "./api.js";

// Backend: POST /api/auths/login
// Body: { email, password }
// Response (Result<string?> envelope): { data: "<jwt>", resultStatus, messages }
export const login = async (email, password) => {
  try {
    const response = await api.post("/api/auths/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.messages?.[0] ||
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        "Login failed"
    );
  }
};
