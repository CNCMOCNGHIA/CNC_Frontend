import api from "./api.js";

// Backend (Result<T> envelope):
//   GET    /api/categories/name?categoryName=...
//   POST   /api/categories            body: { parentId?, name }
//   DELETE /api/categories/{id}
//
// Response item: { id, parentId, name, level, children: [...] }

export const getCategories = async (name) => {
  try {
    const response = await api.get("/api/categories/name", {
      params: { categoryName: name },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createCategory = async ({ parentId, name }) => {
  try {
    const response = await api.post("/api/categories", { parentId, name });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
