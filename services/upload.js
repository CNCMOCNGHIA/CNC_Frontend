import api from "./api.js";

// Backend contract (per BACKEND.md):
//   POST /uploads
//     multipart/form-data: field `file`, optional `folder`
//     headers: Authorization: Bearer <token>
//     response 200: { data: { url } }
//
//   DELETE /uploads
//     body: { urls: string[] }
//     response: 204

export const uploadImage = async (file, folder = "uploads") => {
  const formData = new FormData();
  formData.append("file", file);
  if (folder) formData.append("folder", folder);

  const response = await api.post("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data?.data?.url ?? response.data?.url;
};

export const deleteImages = async (urls) => {
  if (!urls) return;
  const list = Array.isArray(urls) ? urls : [urls];
  if (list.length === 0) return;
  try {
    await api.delete("/uploads", { data: { urls: list } });
  } catch (error) {
    console.error("Error deleting images:", error);
  }
};
