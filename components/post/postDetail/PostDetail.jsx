"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";

import "react-quill-new/dist/quill.snow.css";
import "./PostDetail.css";
import { uploadImage } from "@/services/upload";
import { validateImage } from "@/lib/uploadValidate";
import { getCategories } from "@/services/category";
import { buildCategoryTree } from "@/lib/categoryTree";
import { updatePost, getPost } from "@/services/post";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const PostDetail = ({ postId, onClose }) => {
  const [postData, setPostData] = useState({
    id: "",
    title: "",
    description: "",
    categoryId: "",
    categoryName: "",
    image: "",
  });
  const [editorHtml, setEditorHtml] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const quillRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (postId) {
          const result = await getPost(postId);
          const data = result.data;
          setPostData({
            id: data.postId,
            title: data.title,
            description: data.description,
            categoryId: data.categoryId,
            categoryName: data.categoryName,
            image: data.images?.[0] ?? "",
          });
          setEditorHtml(data.description || "");
        }

        const categoriesResult = await getCategories("Blog");
        setCategories(buildCategoryTree(categoriesResult?.data));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!quillRef.current || !file) return;

      const validationError = validateImage(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);

      try {
        setIsUploading(true);
        const url = await uploadImage(file);
        quill.insertEmbed(range.index, "image", url);
        quill.setSelection(range.index + 1);
      } catch (err) {
        console.error("Error uploading image:", err);
        setError("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "link"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["image"],
        ],
        handlers: { image: imageHandler },
      },
    }),
    []
  );

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const validationError = validateImage(files[0]);
    if (validationError) {
      toast.error(validationError);
      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadImage(files[0]);
      setPostData((prev) => ({ ...prev, image: url }));
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);
      setError(null);

      if (!postData.title.trim()) {
        setError("Title is required");
        return;
      }

      await updatePost(postData.id, {
        ...postData,
        description: editorHtml,
        images: postData.image ? [postData.image] : [],
      });
      toast.success("Cập nhật bài đăng thành công");
      onClose();
    } catch (err) {
      console.error("Error updating post:", err);
      setError("Failed to update post. Please try again.");
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

      <div className="relative bg-white rounded-lg shadow-2xl w-[90vw] h-[90vh] border border-gray-600">
        <div className="px-6 py-4 border-b border-gray-500 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">Chi Tiết Bài Đăng</h2>
        </div>

        <div className="p-6 h-[calc(90vh-8rem)] overflow-y-auto">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <h3 className="text-black text-sm font-medium mb-2">
                  Tiêu Đề
                </h3>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none"
                  value={postData.title}
                  onChange={(e) =>
                    setPostData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              <div className="mb-6 mt-6">
                <h3 className="text-black text-sm font-medium">Hình ảnh</h3>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {postData.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={postData.image}
                        alt="Post"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-black text-sm font-medium mb-2">
                  Danh mục
                </h3>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none"
                  value={postData.categoryId}
                  onChange={(e) =>
                    setPostData((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="preview-container">
              <div className="flex flex-col h-screen">
                <ReactQuill
                  ref={quillRef}
                  value={editorHtml}
                  onChange={setEditorHtml}
                  modules={modules}
                  className="flex-1"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "800px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

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

export default PostDetail;
