import api from "./api.js";

// Backend (new envelope { data } / { error: { code, message } }):
//   GET /pages/:slug                Public
//     200 → { data: { slug, content: <json>, updatedAt } }
//     404 → { error: { code, message } }   (FE may fall back to default-content/*.json)
//
//   PUT /pages/:slug                Admin
//     headers: Authorization: Bearer <token>
//     body:    { content: <json-object> }
//     200 →    { data: { slug, content, updatedAt } }

export const getPage = async (slug, { fallback } = {}) => {
  try {
    const response = await api.get(`/pages/${slug}`);
    return response.data;
  } catch (error) {
    if (error?.response?.status === 404 && fallback !== undefined) {
      return { data: { slug, content: fallback } };
    }
    console.error(`Error fetching page "${slug}":`, error);
    if (fallback !== undefined) {
      return { data: { slug, content: fallback } };
    }
    throw error;
  }
};

export const updatePage = async (slug, content) => {
  try {
    const response = await api.put(`/pages/${slug}`, { content });
    return response.data;
  } catch (error) {
    console.error(`Error updating page "${slug}":`, error);
    throw error;
  }
};

// Gọi sau khi save để Next revalidate cache cho trang public.
export const revalidatePage = async (slug) => {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
  } catch (error) {
    console.error("Revalidate request failed:", error);
  }
};
