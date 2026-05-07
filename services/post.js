import api from "./api.js";

// Backend: Blogs (Result<T> envelope)
//   GET    /api/blogs?Page=&PageSize=&Search=        Public  list + paging
//   GET    /api/blogs/{blogId}                       Public  detail
//   PUT    /api/blogs?blogId={guid?}                 Admin   upsert
//   DELETE /api/blogs/{blogId}                       Admin
//
// Backend item:
//   { id, thumbnail, title, description, isFeatured, createdAt, categoryId, categoryName, images }
//
// FE legacy shape used by callers: { postId, createDate, ... }
// `mapBlog` keeps existing UI working until callers migrate.

const mapBlog = (blog) => {
  if (!blog || typeof blog !== "object") return blog;
  return {
    ...blog,
    postId: blog.postId ?? blog.id,
    createDate: blog.createDate ?? blog.createdAt,
    type: "Post",
  };
};

const mapPaged = (envelope) => {
  if (!envelope?.data?.items) return envelope;
  return {
    ...envelope,
    data: { ...envelope.data, items: envelope.data.items.map(mapBlog) },
  };
};

const mapSingle = (envelope) =>
  envelope?.data ? { ...envelope, data: mapBlog(envelope.data) } : envelope;

export const getPosts = async (
  pageNumber = 1,
  pageSize = 5,
  _categoryName,
  search
) => {
  try {
    const response = await api.get("/api/blogs", {
      params: {
        pageNumber,
        pageSize,
        ...(search ? { search } : {}),
      },
    });
    return mapPaged(response.data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const getPost = async (id) => {
  try {
    const response = await api.get(`/api/blogs/${id}`);
    return mapSingle(response.data);
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

// Upsert: omit blogId to create.
export const createPost = async (post) => {
  try {
    const response = await api.put("/api/blogs", post);
    return mapSingle(response.data);
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Upsert: pass blogId to update.
export const updatePost = async (id, post) => {
  try {
    const response = await api.put("/api/blogs", post, {
      params: { blogId: id },
    });
    return mapSingle(response.data);
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    const response = await api.delete(`/api/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
