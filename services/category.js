import api from "./api.js";

// Backend (Result<T> envelope):
//   GET    /api/categories?type=Product|Blog
//                                     response: { data: CategoryResponse[], resultStatus, messages }
//                                     CategoryResponse: { id, parentId, name, level, type, childrenIds }
//                                     (FLAT list — FE phải tự build tree qua lib/categoryTree.js)
//
//   POST   /api/categories            Authorization: Bearer <jwt>
//                                     body: { name, type, parentId? }
//                                     parent (nếu có) phải cùng type.
//
//   DELETE /api/categories/{id}       Authorization: Bearer <jwt>

export const getCategories = async (type = "Product") => {
  try {
    const response = await api.get("/api/categories", {
      params: { type },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createCategory = async ({ name, type, parentId = null }) => {
  try {
    const response = await api.post("/api/categories", { name, type, parentId });
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
