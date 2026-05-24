import api from "./api.js";

// Backend: Quotas
//   GET    /api/quotas?Page=&PageSize=&Search=                Public  paged list (sorted by createDate desc on BE)
//   GET    /api/quotas/{id}                                   Public  detail
//   POST   /api/quotas                                        Public  multipart/form-data (anonymous)
//   PUT    /api/quotas/{id}                                   Admin   multipart/form-data
//   DELETE /api/quotas/{id}                                   Admin
//
// FileResponse (list & detail dùng chung shape):
//   { id, fileName, extension, url }   // url ví dụ "/uploads/quotas/8f3e2a....dwg"
// Download (anonymous, trả file với tên gốc + Content-Disposition: attachment):
//   GET /api/quotas/files/{file.id}/download
// Dùng resolveQuotaFileUrl(file) để build link.
//
// QuotaResponse:
//   { id, fullName, phoneNumber, email, materialType, quantity,
//     deliveryTime?, note?, createDate (ISO UTC), files: FileResponse[] }
//
// Validation phía BE (POST/PUT, 400 ProblemDetails khi sai):
//   FullName     required, 1–100 ký tự
//   PhoneNumber  required, regex ^(0|\+84)(\d{9,10})$
//   Email        required, email hợp lệ
//   MaterialType required
//   Quantity     integer ≥ 1
//   DeliveryTime, Note optional
//
// File upload whitelist (sai → 400 với { resultStatus:3, messages:[...] }):
//   .dwg, .dxf, .pdf, .skp, .3dm, .3dmbak, .3mf, .3ds, .stl
//
// DELETE response:
//   { data: string[] /* URL các file vừa xoá */, resultStatus: 0,
//     messages: ["Quota deleted successfully"] }
//   → đọc message từ messages[0], KHÔNG phải data.

const buildQuotaFormData = ({
  fullName,
  phoneNumber,
  email,
  materialType,
  quantity,
  deliveryTime,
  note,
  files,
} = {}) => {
  const fd = new FormData();
  if (fullName !== undefined) fd.append("FullName", fullName);
  if (phoneNumber !== undefined) fd.append("PhoneNumber", phoneNumber);
  if (email !== undefined) fd.append("Email", email);
  if (materialType !== undefined) fd.append("MaterialType", materialType);
  if (quantity !== undefined && quantity !== null && quantity !== "") {
    fd.append("Quantity", String(quantity));
  }
  if (deliveryTime) fd.append("DeliveryTime", deliveryTime);
  if (note) fd.append("Note", note);
  (files ?? []).forEach((file) => {
    if (file instanceof File || file instanceof Blob) {
      fd.append("Files", file);
    }
  });
  return fd;
};

export const getQuotas = async ({ page = 1, pageSize = 10, search } = {}) => {
  try {
    const response = await api.get("/api/quotas", {
      params: {
        Page: page,
        PageSize: pageSize,
        ...(search ? { Search: search } : {}),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching quotas:", error);
    throw error;
  }
};

export const getQuota = async (id) => {
  try {
    const response = await api.get(`/api/quotas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching quota:", error);
    throw error;
  }
};

export const createQuota = async (payload) => {
  try {
    const response = await api.post("/api/quotas", buildQuotaFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating quota:", error);
    throw error;
  }
};

export const updateQuota = async (id, payload) => {
  try {
    const response = await api.put(`/api/quotas/${id}`, buildQuotaFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating quota:", error);
    throw error;
  }
};

export const deleteQuota = async (id) => {
  try {
    const response = await api.delete(`/api/quotas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting quota:", error);
    throw error;
  }
};

// Lấy URL tải file CAD từ FileResponse.
// BE endpoint: GET /api/quotas/files/{fileId}/download (anonymous, không cần JWT)
// → trả file với tên gốc (vd ban_ve.skp) thay vì GUID, Content-Disposition: attachment.
export const resolveQuotaFileUrl = (file) => {
  if (!file?.id) return "";
  const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  return `${base}/api/quotas/files/${file.id}/download`;
};

// Parse ASP.NET ProblemDetails (HTTP 400) → { FieldName: "message", ... }
// Dùng cho react-hook-form setError sau khi server reject.
export const parseQuotaValidationErrors = (error) => {
  const data = error?.response?.data;
  if (!data || typeof data !== "object") return null;
  if (!data.errors || typeof data.errors !== "object") return null;
  const out = {};
  for (const [field, messages] of Object.entries(data.errors)) {
    if (Array.isArray(messages) && messages.length > 0) {
      out[field] = messages[0];
    } else if (typeof messages === "string") {
      out[field] = messages;
    }
  }
  return Object.keys(out).length ? out : null;
};

export const QUOTA_ALLOWED_EXTENSIONS = [
  ".dwg",
  ".dxf",
  ".pdf",
  ".skp",
  ".3dm",
  ".3dmbak",
  ".3mf",
  ".3ds",
  ".stl",
];

export const VN_PHONE_REGEX = /^(0|\+84)(\d{9,10})$/;
