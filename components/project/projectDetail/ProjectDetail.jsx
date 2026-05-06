"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";

import "react-quill-new/dist/quill.snow.css";
import "./ProjectDetail.css";
import { uploadImage, deleteImages } from "@/services/upload";
import { getCategories } from "@/services/category";
import { getProject, updateProject } from "@/services/project";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const findCategoryHierarchy = (categoryList, targetCategoryId) => {
  const hierarchy = { level2: null, level3: null, level4: null };

  for (const level2 of categoryList) {
    if (level2.categoryId === targetCategoryId) {
      hierarchy.level2 = level2;
      return hierarchy;
    }
    for (const level3 of level2.children || []) {
      if (level3.categoryId === targetCategoryId) {
        hierarchy.level2 = level2;
        hierarchy.level3 = level3;
        return hierarchy;
      }
      for (const level4 of level3.children || []) {
        if (level4.categoryId === targetCategoryId) {
          hierarchy.level2 = level2;
          hierarchy.level3 = level3;
          hierarchy.level4 = level4;
          return hierarchy;
        }
      }
    }
  }
  return hierarchy;
};

const ProjectDetail = ({ projectId, onClose }) => {
  const [projectData, setProjectData] = useState({
    id: "",
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    images: [],
  });
  const [selectedCategories, setSelectedCategories] = useState({
    level2: null,
    level3: null,
    level4: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [editorHtml, setEditorHtml] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteOldImages, setDeleteOldImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    const initialize = async () => {
      setIsLoading(true);
      try {
        const projectResult = await getProject(projectId);
        const data = projectResult.data;
        setProjectData({
          id: data.postId,
          title: data.title,
          description: data.description,
          price: data.price ?? "",
          stock: data.stock ?? "",
          categoryId: data.categoryId,
          images: data.images || [],
        });
        setEditorHtml(data.description || "");
        setImages(data.images || []);

        const categoryResult = await getCategories("Project");
        const categoryList = categoryResult.data?.[0]?.children ?? [];
        setCategories(categoryList);

        if (data.categoryId && categoryList.length) {
          setSelectedCategories(
            findCategoryHierarchy(categoryList, data.categoryId)
          );
        }
      } catch (err) {
        setError("Error initializing data");
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [projectId]);

  const handleCategoryChange = (level, category) => {
    const next = { ...selectedCategories };
    if (level === 2) {
      next.level2 = category;
      next.level3 = null;
      next.level4 = null;
    } else if (level === 3) {
      next.level3 = category;
      next.level4 = null;
    } else if (level === 4) {
      next.level4 = category;
    }
    setSelectedCategories(next);
  };

  const renderCategorySelectors = () => (
    <div className="grid grid-cols-3 gap-4">
      <select
        className="w-full p-2 border rounded-md"
        value={selectedCategories.level2?.categoryId || ""}
        onChange={(e) => {
          const category = categories.find(
            (c) => c.categoryId === e.target.value
          );
          handleCategoryChange(2, category);
        }}
      >
        <option value="">Chọn danh mục cấp 2</option>
        {categories.map((cat) => (
          <option key={cat.categoryId} value={cat.categoryId}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        className="w-full p-2 border rounded-md"
        value={selectedCategories.level3?.categoryId || ""}
        onChange={(e) => {
          const category = selectedCategories.level2?.children?.find(
            (c) => c.categoryId === e.target.value
          );
          handleCategoryChange(3, category);
        }}
        disabled={!selectedCategories.level2}
      >
        <option value="">Chọn danh mục cấp 3</option>
        {selectedCategories.level2?.children?.map((cat) => (
          <option key={cat.categoryId} value={cat.categoryId}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        className="w-full p-2 border rounded-md"
        value={selectedCategories.level4?.categoryId || ""}
        onChange={(e) => {
          const category = selectedCategories.level3?.children?.find(
            (c) => c.categoryId === e.target.value
          );
          handleCategoryChange(4, category);
        }}
        disabled={
          !selectedCategories.level3 ||
          !selectedCategories.level3.children?.length
        }
      >
        <option value="">Chọn danh mục cấp 4</option>
        {selectedCategories.level3?.children?.map((cat) => (
          <option key={cat.categoryId} value={cat.categoryId}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "link"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
    ],
  };

  const handleImageUpload = (event) => {
    setNewImages(Array.from(event.target.files));
  };

  const handleDeleteNewImage = (indexToDelete) => {
    setNewImages((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  const handleDeleteOldImage = (filename) => {
    setImages((prev) => prev.filter((image) => image !== filename));
    setDeleteOldImages((prev) => [...prev, filename]);
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);
      let updatedImageUrls = [...images];

      if (newImages.length > 0) {
        const uploaded = await Promise.all(
          newImages.map((image) => uploadImage(image, "projects"))
        );
        updatedImageUrls = [...updatedImageUrls, ...uploaded];
      }

      if (deleteOldImages.length > 0) {
        await deleteImages(deleteOldImages);
      }

      const finalCategoryId =
        selectedCategories.level4?.categoryId ||
        selectedCategories.level3?.categoryId ||
        selectedCategories.level2?.categoryId ||
        projectData.categoryId;

      const priceNum = Number(projectData.price);
      const stockNum = Number(projectData.stock);
      if (!Number.isFinite(priceNum) || priceNum < 0) {
        toast.error("Giá không hợp lệ");
        setIsUploading(false);
        return;
      }
      if (!Number.isInteger(stockNum) || stockNum < 0) {
        toast.error("Số lượng tồn kho không hợp lệ");
        setIsUploading(false);
        return;
      }

      await updateProject(projectData.id, {
        ...projectData,
        description: editorHtml,
        price: priceNum,
        stock: stockNum,
        categoryId: finalCategoryId,
        images: updatedImageUrls,
      });
      toast.success("Cập nhật sản phẩm thành công");
      onClose();
    } catch (err) {
      console.error("Error updating project:", err);
      setError("Failed to update project. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black/70" />
        <div className="relative bg-white rounded-lg shadow-2xl w-[1024px] h-[600px] border border-gray-600 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-2xl w-[1024px] h-[600px] border border-gray-600">
        <div className="px-6 py-4 border-b border-gray-500">
          <h2 className="text-xl font-semibold text-black">Chi tiết sản phẩm</h2>
        </div>

        <div className="p-6 h-[calc(600px-8rem)] overflow-y-auto">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-black text-sm font-medium mb-2">Tiêu Đề</h3>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={projectData.title}
              onChange={(e) =>
                setProjectData({ ...projectData, title: e.target.value })
              }
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-black text-sm font-medium mb-2">Giá (VND)</h3>
              <input
                type="number"
                min="0"
                step="1000"
                className="w-full p-2 border rounded-md"
                value={projectData.price}
                onChange={(e) =>
                  setProjectData({ ...projectData, price: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div>
              <h3 className="text-black text-sm font-medium mb-2">Tồn kho</h3>
              <input
                type="number"
                min="0"
                step="1"
                className="w-full p-2 border rounded-md"
                value={projectData.stock}
                onChange={(e) =>
                  setProjectData({ ...projectData, stock: e.target.value })
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-black text-sm font-medium mb-2">Danh mục</h3>
            {renderCategorySelectors()}
          </div>

          <h3 className="text-black text-sm font-medium mb-2">Nội dung</h3>
          <div>
            <ReactQuill
              value={editorHtml}
              onChange={setEditorHtml}
              className="quill-editor"
              modules={modules}
            />
          </div>

          <div className="mb-6 mt-6">
            <h3 className="text-black text-sm font-medium mb-2">Hình ảnh</h3>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="h-48 overflow-hidden relative group"
                >
                  <img
                    src={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                    alt={`upload-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                      title="Xem chi tiết"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteOldImage(image)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                      title="Xóa ảnh"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 mt-6">
            <h3 className="text-black text-sm font-medium mb-2">
              Thêm hình ảnh
            </h3>
            <input type="file" multiple onChange={handleImageUpload} />
            <div className="grid grid-cols-3 gap-4 mt-4">
              {newImages.map((image, index) => (
                <div
                  key={index}
                  className="h-48 overflow-hidden relative group"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`upload-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                      title="Xem chi tiết"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteNewImage(index)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                      title="Xóa ảnh"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-200"
                onClick={() => setSelectedImage(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <img
                src={
                  typeof selectedImage === "string"
                    ? selectedImage
                    : URL.createObjectURL(selectedImage)
                }
                alt="Detail view"
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-500 flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-black transition-colors"
            onClick={onClose}
            disabled={isUploading}
          >
            Đóng
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleSave}
            disabled={isUploading}
          >
            {isUploading ? "Đang tải lên..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
