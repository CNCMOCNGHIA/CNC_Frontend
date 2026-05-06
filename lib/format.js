const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export const formatVND = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "—";
  return vndFormatter.format(num);
};

// BE trả ảnh có thể là URL tuyệt đối ("https://...") hoặc đường dẫn tương đối
// (vd "/uploads/seed/products/abc.jpg"). Hàm này resolve relative path về API
// host để browser load được.
export const resolveImageUrl = (url) => {
  if (!url || typeof url !== "string") return url ?? "";
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  if (!base) return url;
  return `${base.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
};

export const formatDateVN = (value) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
