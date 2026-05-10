import api, { unwrap } from "./api.js";

// Backend: Blogs. Envelope is Result<T>; helpers return T after unwrap.
//
//   GET    /api/blogs?pageNumber=&pageSize=&search=    Public  list (search = title contains, case-sensitive)
//   GET    /api/blogs/{blogId}                         Public  detail
//   POST   /api/blogs                                  Admin   create  → returns new id (string)
//   PUT    /api/blogs/{blogId}                         Admin   update  → returns true
//   DELETE /api/blogs/{blogId}                         Admin
//
// Canonical Blog shape:
//   { id, thumbnail, title, description, isFeatured, createdAt,
//     categoryId, categoryName, images: string[] }
//
// Quirks:
// - PUT replaces fields including images; sending null/omitting clears them.
// - 4xx/5xx with envelope are normalized into ApiError by the response interceptor.

export const getBlogs = async ({
  pageNumber = 1,
  pageSize = 10,
  search,
} = {}) => {
  const response = await api.get("/api/blogs", {
    params: {
      pageNumber,
      pageSize,
      ...(search ? { search } : {}),
    },
  });
  return unwrap(response.data);
};

export const getBlog = async (id) => {
  const response = await api.get(`/api/blogs/${id}`);
  return unwrap(response.data);
};

export const createBlog = async (payload) => {
  const response = await api.post("/api/blogs", payload);
  return unwrap(response.data); // new blog id (string)
};

export const updateBlog = async (id, payload) => {
  const response = await api.put(`/api/blogs/${id}`, payload);
  return unwrap(response.data); // true
};

export const deleteBlog = async (id) => {
  const response = await api.delete(`/api/blogs/${id}`);
  return unwrap(response.data);
};
