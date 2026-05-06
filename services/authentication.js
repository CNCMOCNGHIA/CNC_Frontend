import api from "./api.js";

// Backend: GET /api/auths?email=&password=
// Response (Result<string?> envelope): { data: "<jwt>", resultStatus, messages }
export const login = async (email, password) => {
  try {
    const response = await api.get("/api/auths", {
      params: { email, password },
    });
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
