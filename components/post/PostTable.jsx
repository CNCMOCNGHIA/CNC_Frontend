"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Edit,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import CreatePost from "./createPost/CreatePost";
import PostDetail from "./postDetail/PostDetail";
import { getBlogs, deleteBlog } from "@/services/post";
import { formatDateVN, resolveImageUrl } from "@/lib/format";

const PostTable = () => {
  const [page, setPage] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const loadPage = async (pageNumber, search) => {
    try {
      const result = await getBlogs({
        pageNumber,
        pageSize: 5,
        ...(search ? { search } : {}),
      });
      setFilteredPosts(result?.items ?? []);
      setPage({
        pageNumber: result?.pageNumber ?? pageNumber,
        pageSize: result?.pageSize ?? 5,
        totalCount: result?.totalCount ?? 0,
        totalPages: result?.totalPages ?? 0,
        hasNext: result?.hasNext ?? false,
        hasPrevious: result?.hasPrevious ?? false,
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Không thể tải danh sách bài đăng");
    }
  };

  useEffect(() => {
    loadPage(1, "");
  }, []);

  const handlePageChange = async (value) => {
    await loadPage(value, searchTerm);
    window.scrollTo(0, 0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadPage(1, searchTerm.trim());
  };

  const handleDeleteBlog = async (id) => {
    if (!id) return;
    if (!window.confirm("Bạn có chắc muốn xóa bài đăng này không?")) return;
    try {
      await deleteBlog(id);
      toast.success("Xóa bài đăng thành công!");
      await loadPage(page.pageNumber, searchTerm);
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error(error?.messages?.[0] ?? "Xóa bài đăng thất bại!");
    }
  };

  const openCreatePost = () => setIsCreatePostOpen(true);
  const closeCreatePost = () => {
    setIsCreatePostOpen(false);
    loadPage(page.pageNumber, searchTerm);
  };
  const openPostDetail = (id) => {
    setSelectedPostId(id);
    setIsPostDetailOpen(true);
  };
  const closePostDetail = () => {
    setSelectedPostId(null);
    setIsPostDetailOpen(false);
    loadPage(page.pageNumber, searchTerm);
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <h2 className="text-xl font-semibold text-black">Quản Lý Bài Đăng</h2>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Tìm bài đăng..."
            className="bg-black text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-white" size={18} />
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Tiêu đề
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Ngày Đăng
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredPosts.map((post) => {
              const thumbUrl = resolveImageUrl(post.thumbnail);
              return (
                <motion.tr
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black flex gap-2 items-center">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={post.title ?? "thumbnail"}
                        className="size-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-gray-200" />
                    )}
                    {post.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {post.categoryName ?? "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {formatDateVN(post.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => openPostDetail(post.id)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteBlog(post.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
            <tr>
              <td
                colSpan="4"
                className="px-6 py-4 whitespace-nowrap text-sm text-black text-center"
              >
                <button
                  className="text-blue-700 hover:text-blue-500"
                  onClick={openCreatePost}
                >
                  + Thêm bài đăng mới
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4 px-6">
          <div className="text-sm text-black">
            Showing {(page.pageNumber - 1) * page.pageSize + 1} to{" "}
            {Math.min(page.pageNumber * page.pageSize, page.totalCount)} of{" "}
            {page.totalCount} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page.pageNumber - 1)}
              disabled={!page.hasPrevious}
              className="p-2 rounded-lg bg-black text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="flex items-center px-4 text-black">
              Page {page.pageNumber} of {page.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page.pageNumber + 1)}
              disabled={!page.hasNext}
              className="p-2 rounded-lg bg-black text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {isCreatePostOpen && <CreatePost onClose={closeCreatePost} />}
      {isPostDetailOpen && (
        <PostDetail postId={selectedPostId} onClose={closePostDetail} />
      )}
    </motion.div>
  );
};

export default PostTable;
