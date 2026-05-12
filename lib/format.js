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
// trên BE (vd "/uploads/...", "uploads/...", "seed/..."). Hàm này resolve về
// API host để browser load được.
//
// Quy tắc:
//  - URL tuyệt đối (http(s)/data/blob) → giữ nguyên
//  - Path FE-bundled (/images/... trong public/) → giữ nguyên để Next.js phục vụ
//  - Mọi path khác → coi là BE-served, prefix NEXT_PUBLIC_API_URL
export const resolveImageUrl = (url) => {
  if (!url || typeof url !== "string") return url ?? "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
  if (/^\/?images\//.test(trimmed)) {
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  if (!base) return trimmed;
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${base.replace(/\/$/, "")}${path}`;
};

// Strip HTML tags & decode common entities to produce a plain-text preview
// for list cards (titles/excerpts) where rich-text rendering isn't appropriate.
export const stripHtml = (html) => {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
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
