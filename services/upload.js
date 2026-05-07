import api from "./api.js";

// Backend contract:
//   POST /api/uploads
//     multipart/form-data: field `file` (jpg/jpeg/png/webp, max 10MB)
//     headers: Authorization: Bearer <token>
//     response 200: { url: "/uploads/abc.jpg" }   // path tương đối
//     response 400: { message: "..." }
//     response 401: chưa login admin
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/api/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data?.url ?? response.data?.data?.url;
};
