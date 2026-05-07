import api from "./api.js";

// Backend: Products (Result<T> envelope)
//   GET    /api/products?Page=&PageSize=&Search=          Public  list + paging
//   GET    /api/products/{productId}                      Public  detail
//   GET    /api/products/3-favourite-product              Public  3 nổi bật
//   POST   /api/products                                  Admin   create
//   PUT    /api/products/{productId}                      Admin   update
//   DELETE /api/products/{productId}                      Admin
//   PUT    /api/products/{productId}/check-favourite      Admin   toggle (≤3)
//
// Backend item: { thumbnail, title, subtitle, minPrice, maxPrice, description,
//                 createDate, isFavourite, category: { id, name }, images }
//
// FE legacy shape used by ProjectDetail/ProductTable:
//   { postId, categoryId, categoryName, ... }
// `mapProduct` bridges the two until callers migrate.

const mapProduct = (product) => {
  if (!product || typeof product !== "object") return product;
  return {
    ...product,
    postId: product.postId ?? product.id ?? product.productId,
    categoryId: product.categoryId ?? product.category?.id,
    categoryName: product.categoryName ?? product.category?.name,
  };
};

const mapPaged = (envelope) => {
  if (!envelope?.data?.items) return envelope;
  return {
    ...envelope,
    data: { ...envelope.data, items: envelope.data.items.map(mapProduct) },
  };
};

const mapSingle = (envelope) =>
  envelope?.data ? { ...envelope, data: mapProduct(envelope.data) } : envelope;

export const getProjects = async (pageNumber = 1, pageSize = 5, search) => {
  try {
    const response = await api.get("/api/products", {
      params: {
        pageNumber,
        pageSize,
        ...(search ? { search } : {}),
      },
    });
    return mapPaged(response.data);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProject = async (id) => {
  try {
    const response = await api.get(`/api/products/${id}`);
    return mapSingle(response.data);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getFavouriteProducts = async () => {
  try {
    const response = await api.get("/api/products/3-favourite-product");
    if (Array.isArray(response.data?.data)) {
      return {
        ...response.data,
        data: response.data.data.map(mapProduct),
      };
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching favourite products:", error);
    throw error;
  }
};

export const createProject = async (project) => {
  try {
    const response = await api.post("/api/products", project);
    return mapSingle(response.data);
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProject = async (id, project) => {
  try {
    const response = await api.put(`/api/products/${id}`, project);
    return mapSingle(response.data);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const toggleFavouriteProduct = async (id) => {
  try {
    const response = await api.put(`/api/products/${id}/check-favourite`);
    return response.data;
  } catch (error) {
    console.error("Error toggling favourite:", error);
    throw error;
  }
};
