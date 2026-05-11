"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Star } from "lucide-react";

import "react-quill-new/dist/quill.snow.css";
import "./PostDetail.css";
import { uploadImage } from "@/services/upload";
import { validateImage } from "@/lib/uploadValidate";
import { getCategories } from "@/services/category";
import { buildCategoryTree } from "@/lib/categoryTree";
import { updateBlog, getBlog } from "@/services/post";
import { resolveImageUrl } from "@/lib/format";
import { toYouTubeEmbedUrl } from "@/lib/youtube";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const PostDetail = ({ postId, onClose }) => {
  const [postData, setPostData] = useState({
    id: "",
    title: "",
    description: "",
    isFeatured: false,
    categoryId: "",
  });
  const [images, setImages] = useState([]); // existing URLs
  const [newImages, setNewImages] = useState([]); // pending File[]
  // thumbnailRef: { type: "url", url } | { type: "newIndex", index } | null
  const [thumbnailRef, setThumbnailRef] = useState(null);
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
          const data = await getBlog(postId);
          setPostData({
            id: data.id,
            title: data.title ?? "",
            description: data.description ?? "",
            isFeatured: Boolean(data.isFeatured),
            categoryId: data.categoryId ?? "",
          });
          setImages(data.images ?? []);
          setThumbnailRef(
            data.thumbnail ? { type: "url", url: data.thumbnail } : null
          );
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
        quill.insertEmbed(range.index, "image", resolveImageUrl(url));
        quill.setSelection(range.index + 1);
      } catch (err) {
        console.error("Error uploading image:", err);
        setError("Failed to upload image. Please try again.");
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
          [{ header: [1, 2, 3, false] }],
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
    setNewImages(files);
  };

  const handleDeleteOldImage = (url) => {
    setImages((prev) => prev.filter((image) => image !== url));
    setThumbnailRef((prev) =>
      prev?.type === "url" && prev.url === url ? null : prev
    );
  };

  const handleDeleteNewImage = (indexToDelete) => {
    setNewImages((prev) => prev.filter((_, index) => index !== indexToDelete));
    setThumbnailRef((prev) => {
      if (prev?.type !== "newIndex") return prev;
      if (prev.index === indexToDelete) return null;
      return prev.index > indexToDelete
        ? { type: "newIndex", index: prev.index - 1 }
        : prev;
    });
  };

  const isExistingThumb = (url) =>
    thumbnailRef?.type === "url" && thumbnailRef.url === url;
  const isNewThumb = (index) =>
    thumbnailRef?.type === "newIndex" && thumbnailRef.index === index;

  const handleSave = async () => {
    setError(null);
    if (!postData.title.trim()) {
      setError("Tiêu đề không được trống");
      toast.error("Tiêu đề không được trống");
      return;
    }

    try {
      setIsUploading(true);
      let uploadedNewUrls = [];
      if (newImages.length > 0) {
        uploadedNewUrls = await Promise.all(
          newImages.map((image) => uploadImage(image))
        );
      }
      const finalImages = [...images, ...uploadedNewUrls];

      if (!finalImages.length) {
        toast.error("Bài đăng phải có ít nhất 1 ảnh");
        setIsUploading(false);
        return;
      }

      let thumbnail = null;
      if (thumbnailRef?.type === "url" && finalImages.includes(thumbnailRef.url)) {
        thumbnail = thumbnailRef.url;
      } else if (
        thumbnailRef?.type === "newIndex" &&
        uploadedNewUrls[thumbnailRef.index]
      ) {
        thumbnail = uploadedNewUrls[thumbnailRef.index];
      } else {
        thumbnail = finalImages[0];
      }

      await updateBlog(postData.id, {
        thumbnail,
        title: postData.title,
        description: editorHtml,
        isFeatured: postData.isFeatured,
        categoryId: postData.categoryId || null,
        images: finalImages,
      });
      toast.success("Cập nhật bài đăng thành công");
      onClose();
    } catch (err) {
      console.error("Error updating blog:", err);
      const message = err?.messages?.[0] ?? "Failed to update blog. Please try again.";
      setError(message);
      toast.error(message);
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
                <h3 className="text-black text-sm font-medium mb-2">Hình ảnh</h3>
                <p className="text-xs text-gray-500 mb-2">
                  Click ngôi sao để chọn ảnh đại diện (thumbnail).
                </p>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {images.map((image, index) => {
                    const isThumb = isExistingThumb(image);
                    return (
                      <div
                        key={image}
                        className={`h-48 overflow-hidden relative group border-2 ${
                          isThumb ? "border-amber-500" : "border-transparent"
                        }`}
                      >
                        <img
                          src={resolveImageUrl(image)}
                          alt={`blog-${index}`}
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
                            onClick={() =>
                              setThumbnailRef({ type: "url", url: image })
                            }
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
                    );
                  })}
                </div>
              </div>

              <div className="mb-6 mt-6">
                <h3 className="text-black text-sm font-medium mb-2">
                  Thêm hình ảnh
                </h3>
                <input
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {newImages.map((image, index) => {
                    const isThumb = isNewThumb(index);
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
                            onClick={() =>
                              setThumbnailRef({ type: "newIndex", index })
                            }
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

              <div className="mb-4">
                <label className="flex items-center gap-2 text-black text-sm font-medium select-none">
                  <input
                    type="checkbox"
                    className="size-4"
                    checked={postData.isFeatured}
                    onChange={(e) =>
                      setPostData((prev) => ({
                        ...prev,
                        isFeatured: e.target.checked,
                      }))
                    }
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

export default PostDetail;
