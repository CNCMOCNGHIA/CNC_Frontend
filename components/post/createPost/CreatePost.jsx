"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Star } from "lucide-react";

import "react-quill-new/dist/quill.snow.css";
import "./CreatePost.css";
import { uploadImage } from "@/services/upload";
import { validateImage } from "@/lib/uploadValidate";
import { getCategories } from "@/services/category";
import { buildCategoryTree } from "@/lib/categoryTree";
import { createBlog } from "@/services/post";
import { resolveImageUrl } from "@/lib/format";
import { toYouTubeEmbedUrl } from "@/lib/youtube";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const CreatePost = ({ onClose }) => {
  const [images, setImages] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [editorHtml, setEditorHtml] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const quillRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await getCategories("Blog");
        setCategories(buildCategoryTree(result?.data));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    })();
  }, []);

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
        quill.insertEmbed(range.index, "image", resolveImageUrl(url));
        quill.setSelection(range.index + 1);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Tải ảnh lên thất bại");
      } finally {
        setIsUploading(false);
      }
    };
  };

  const videoHandler = () => {
    const raw = window.prompt(
      "Dán link YouTube (vd: https://www.youtube.com/watch?v=..., https://youtu.be/...):"
    );
    if (!raw) return;
    const embedUrl = toYouTubeEmbedUrl(raw);
    if (!embedUrl) {
      toast.error("Link YouTube không hợp lệ");
      return;
    }
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const range = quill.getSelection(true);
    quill.insertEmbed(range.index, "video", embedUrl);
    quill.setSelection(range.index + 1);
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "link"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["image", "video"],
        ],
        handlers: { image: imageHandler, video: videoHandler },
      },
    }),
    []
  );

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    for (const file of files) {
      const validationError = validateImage(file);
      if (validationError) {
        toast.error(`${file.name}: ${validationError}`);
        event.target.value = "";
        return;
      }
    }
    setImages(files);
    setThumbnailIndex(0);
  };

  const handleDeleteImage = (indexToDelete) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToDelete));
    setThumbnailIndex((prev) => {
      if (prev === indexToDelete) return 0;
      return prev > indexToDelete ? prev - 1 : prev;
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    if (!images.length) {
      toast.error("Vui lòng tải lên ít nhất 1 ảnh để làm thumbnail");
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrls = await Promise.all(
        images.map((image) => uploadImage(image))
      );
      const thumbnail = uploadedUrls[thumbnailIndex] ?? uploadedUrls[0];

      await createBlog({
        thumbnail,
        title,
        description: editorHtml,
        isFeatured,
        categoryId: categoryId || null,
        images: uploadedUrls,
      });
      toast.success("Tạo bài đăng thành công");
      onClose();
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error(error?.messages?.[0] ?? "Tạo bài đăng thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black/70"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-2xl w-[90vw] h-[90vh] border border-gray-600">
        <div className="px-6 py-4 border-b border-gray-500 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">Thêm Bài Đăng</h2>
        </div>

        <div className="p-6 h-[calc(90vh-8rem)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <h3 className="text-black text-sm font-medium mb-2">
                  Tiêu Đề
                </h3>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-6 mt-6">
                <h3 className="text-black text-sm font-medium">Hình ảnh</h3>
                <p className="text-xs text-gray-500 mb-2">
                  Click ngôi sao để chọn ảnh đại diện (thumbnail).
                </p>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                  className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {images.map((image, index) => {
                    const isThumb = index === thumbnailIndex;
                    return (
                      <div
                        key={index}
                        className={`h-48 overflow-hidden relative group border-2 ${
                          isThumb ? "border-amber-500" : "border-transparent"
                        }`}
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`upload-${index}`}
                          className="w-full h-full object-cover"
                        />
                        {isThumb && (
                          <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                            Thumbnail
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setThumbnailIndex(index)}
                            className={`p-2 rounded-full transition-colors ${
                              isThumb
                                ? "bg-amber-500 text-white"
                                : "bg-white text-gray-700 hover:bg-amber-500 hover:text-white"
                            }`}
                            title={isThumb ? "Đang là thumbnail" : "Đặt làm thumbnail"}
                          >
                            <Star size={18} fill={isThumb ? "currentColor" : "none"} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(index)}
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
                    );
                  })}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-black text-sm font-medium mb-2">
                  Danh mục
                </h3>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
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

              <div className="mb-4">
                <label className="flex items-center gap-2 text-black text-sm font-medium select-none">
                  <input
                    type="checkbox"
                    className="size-4"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  Đánh dấu nổi bật (Featured)
                </label>
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

export default CreatePost;
