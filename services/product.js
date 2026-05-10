import api, { unwrap } from "./api.js";

// Backend: Products. Envelope is Result<T>; helpers return T after unwrap.
//
//   GET    /api/products?pageNumber=&pageSize=&title=&categoryId=&categoryName=
//                                                         Public  list + paging
//   GET    /api/products/{productId}                      Public  detail
//   GET    /api/products/3-favourite-product              Public  ≤3 featured
//   POST   /api/products                                  Admin   create  → returns new id (string)
//   PUT    /api/products/{productId}                      Admin   update  → returns true
//   DELETE /api/products/{productId}                      Admin
//   PUT    /api/products/{productId}/check-favourite      Admin   toggle (≤3)
//
// Canonical Product shape:
//   { id, thumbnail, title, subtitle, price, stock, description,
//     createDate, isFavourite, category: { id, name, level } | null, images: string[] }
//
// Quirks worth remembering:
// - Filter `title` is case-sensitive contains; `categoryName` is case-insensitive.
//   Sort is fixed BE-side: IsFavourite DESC, CreateDate DESC.
// - PUT replaces `images` wholesale — caller must include URLs it wants to keep.
// - `isFavourite` is ignored in upsert; toggle through check-favourite.
// - DELETE may return resultStatus="NotFound" with HTTP 200 — `unwrap` will throw.
// - check-favourite returns 400 with messages[0]="Enough 3 favourite products"
//   when the limit is exceeded; surfaced via ApiError.messages.

export const getProducts = async ({
  pageNumber = 1,
  pageSize = 10,
  title,
  categoryId,
  categoryName,
} = {}) => {
  const response = await api.get("/api/products", {
    params: {
      pageNumber,
      pageSize,
      ...(title ? { title } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(categoryName ? { categoryName } : {}),
    },
  });
  return unwrap(response.data);
};

export const getProduct = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return unwrap(response.data);
};

export const getFavouriteProducts = async () => {
  const response = await api.get("/api/products/3-favourite-product");
  return unwrap(response.data);
};

export const createProduct = async (payload) => {
  const response = await api.post("/api/products", payload);
  return unwrap(response.data); // new product id (string)
};

export const updateProduct = async (id, payload) => {
  const response = await api.put(`/api/products/${id}`, payload);
  return unwrap(response.data); // true
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/api/products/${id}`);
  return unwrap(response.data);
};

export const toggleFavouriteProduct = async (id) => {
  const response = await api.put(`/api/products/${id}/check-favourite`);
  return unwrap(response.data); // "True" | "False"
};
