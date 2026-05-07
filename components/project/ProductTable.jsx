"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Edit,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  ImageOff,
} from "lucide-react";
import { toast } from "sonner";

import CreateProject from "./createProject/CreateProject";
import ProjectDetail from "./projectDetail/ProjectDetail";
import { getProjects, deleteProject } from "@/services/project";
import { formatVND, formatDateVN, resolveImageUrl } from "@/lib/format";

const PAGE_SIZE = 5;

const ProductTable = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const loadPage = async (pageNumber, search) => {
    setLoading(true);
    try {
      const result = await getProjects(pageNumber, PAGE_SIZE, search);
      setItems(result?.data?.items ?? []);
      setPage({
        pageNumber: result?.data?.pageNumber ?? pageNumber,
        pageSize: result?.data?.pageSize ?? PAGE_SIZE,
        totalCount: result?.data?.totalCount ?? 0,
        totalPages: result?.data?.totalPages ?? 0,
        hasNext: result?.data?.hasNext ?? false,
        hasPrevious: result?.data?.hasPrevious ?? false,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
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

  const handleDeleteProject = async (postId) => {
    if (!postId) {
      toast.error("Sản phẩm không có ID hợp lệ");
      return;
    }
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;
    try {
      await deleteProject(postId);
      toast.success("Xóa sản phẩm thành công!");
      await loadPage(page.pageNumber, searchTerm);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Xóa sản phẩm thất bại!");
    }
  };

  const openCreateProject = () => setIsCreateProjectOpen(true);
  const closeCreateProject = () => {
    setIsCreateProjectOpen(false);
    loadPage(page.pageNumber, searchTerm);
  };
  const openProjectDetail = (projectId) => {
    setSelectedProjectId(projectId);
    setIsProjectDetailOpen(true);
  };
  const closeProjectDetail = () => {
    setSelectedProjectId(null);
    setIsProjectDetailOpen(false);
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
        <h2 className="text-xl font-semibold text-black">Quản Lý Sản Phẩm</h2>
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              className="bg-black text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-white" size={18} />
          </form>
          <button
            onClick={openCreateProject}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                Giá
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Loại
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-black uppercase tracking-wider">
                Yêu thích
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Ngày đăng
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                  Chưa có sản phẩm nào.
                </td>
              </tr>
            ) : (
              items.map((project) => {
                const stock = Number(project.stock ?? 0);
                const outOfStock = stock <= 0;
                const thumbUrl = resolveImageUrl(project.thumbnail);
                return (
                  <motion.tr
                    key={project.postId ?? project.id ?? project.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="px-4 py-3 text-sm text-black">
                      <div className="flex items-center gap-3">
                        {thumbUrl ? (
                          <img
                            src={thumbUrl}
                            alt={project.title ?? "thumbnail"}
                            className="w-12 h-12 rounded object-cover bg-gray-100 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-gray-200 shrink-0 flex items-center justify-center text-gray-400">
                            <ImageOff size={20} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-medium truncate max-w-xs">
                            {project.title}
                          </div>
                          {project.subtitle && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {project.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-black text-right whitespace-nowrap font-medium">
                      {formatVND(project.price)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          outOfStock
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {outOfStock ? "Hết hàng" : `Còn ${stock}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {project.categoryName ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {project.isFavourite ? (
                        <Star
                          size={18}
                          className="text-amber-500 fill-amber-500 inline-block"
                        />
                      ) : (
                        <Star size={18} className="text-gray-300 inline-block" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {formatDateVN(project.createDate)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm whitespace-nowrap">
                      <button
                        className="text-indigo-600 hover:text-indigo-800 mr-3"
                        onClick={() => openProjectDetail(project.postId)}
                        aria-label="Sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteProject(project.postId)}
                        aria-label="Xoá"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>

        {items.length > 0 && (
          <div className="flex justify-between items-center mt-4 px-2">
            <div className="text-sm text-gray-600">
              {(page.pageNumber - 1) * page.pageSize + 1}–
              {Math.min(page.pageNumber * page.pageSize, page.totalCount)} /{" "}
              {page.totalCount} sản phẩm
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => handlePageChange(page.pageNumber - 1)}
                disabled={!page.hasPrevious}
                className="p-2 rounded-lg bg-black text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-3 text-black">
                {page.pageNumber} / {page.totalPages}
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
        )}
      </div>

      {isCreateProjectOpen && <CreateProject onClose={closeCreateProject} />}
      {isProjectDetailOpen && (
        <ProjectDetail
          projectId={selectedProjectId}
          onClose={closeProjectDetail}
        />
      )}
    </motion.div>
  );
};

export default ProductTable;
