"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Star } from "lucide-react";

import "react-quill-new/dist/quill.snow.css";
import "./CreateProduct.css";
import { uploadImage } from "@/services/upload";
import { validateImage } from "@/lib/uploadValidate";
import { getCategories } from "@/services/category";
import { buildCategoryTree } from "@/lib/categoryTree";
import { createProduct } from "@/services/product";
import { resolveImageUrl } from "@/lib/format";
import { toYouTubeEmbedUrl } from "@/lib/youtube";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const CreateProduct = ({ onClose }) => {
  const [images, setImages] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [editorHtml, setEditorHtml] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState({
    level2: null,
    level3: null,
    level4: null,
  });
  const quillRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await getCategories("Product");
        setCategories(buildCategoryTree(result?.data));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    })();
  }, []);

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
        className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      toast.error("Vui lòng tải lên ít nhất 1 ảnh");
      return;
    }
    const finalCategoryId =
      selectedCategories.level4?.categoryId ||
      selectedCategories.level3?.categoryId ||
      selectedCategories.level2?.categoryId;
    if (!finalCategoryId) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    const priceNum = Number(price);
    const stockNum = Number(stock);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      toast.error("Giá không hợp lệ");
      return;
    }
    if (!Number.isInteger(stockNum) || stockNum < 0) {
      toast.error("Số lượng tồn kho không hợp lệ");
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrls = await Promise.all(
        images.map((image) => uploadImage(image))
      );
      const thumbnail =
        uploadedUrls[thumbnailIndex] ?? uploadedUrls[0];

      await createProduct({
        thumbnail,
        title,
        subtitle: subtitle || null,
        price: priceNum,
        stock: stockNum,
        description: editorHtml,
        categoryId: finalCategoryId,
        images: uploadedUrls,
      });
      toast.success("Tạo sản phẩm thành công");
      onClose();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error?.messages?.[0] ?? "Tạo sản phẩm thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-2xl w-[1024px] h-[600px] border border-gray-600">
        <div className="px-6 py-4 border-b border-gray-500">
          <h2 className="text-xl font-semibold text-black">Thêm sản phẩm mới</h2>
        </div>

        <div className="p-6 h-[calc(600px-8rem)] overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-black text-sm font-medium mb-2">Tiêu Đề</h3>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <h3 className="text-black text-sm font-medium mb-2">
              Phụ đề <span className="text-gray-400 font-normal">(không bắt buộc)</span>
            </h3>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-black text-sm font-medium mb-2">Giá (VND)</h3>
              <input
                type="number"
                min="0"
                step="1000"
                className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <h3 className="text-black text-sm font-medium mb-2">Tồn kho</h3>
              <input
                type="number"
                min="0"
                step="1"
                className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
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
              ref={quillRef}
              value={editorHtml}
              onChange={setEditorHtml}
              className="quill-editor"
              modules={modules}
            />
          </div>

          <div className="mb-6 mt-6">
            <h3 className="text-black text-sm font-medium mb-2">Hình ảnh</h3>
            <p className="text-xs text-gray-500 mb-2">
              Click ngôi sao trên ảnh để chọn làm ảnh đại diện (thumbnail).
            </p>
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
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
                    className={`h-48 overflow-hidden relative group border-2 ${isThumb ? "border-amber-500" : "border-transparent"
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
                        onClick={() => setThumbnailIndex(index)}
                        className={`p-2 rounded-full transition-colors ${isThumb
                          ? "bg-amber-500 text-white"
                          : "bg-white text-gray-700 hover:bg-amber-500 hover:text-white"
                          }`}
                        title={isThumb ? "Đang là thumbnail" : "Đặt làm thumbnail"}
                      >
                        <Star size={18} fill={isThumb ? "currentColor" : "none"} />
                      </button>
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
                    src={URL.createObjectURL(selectedImage)}
                    alt="Detail view"
                    className="max-w-full max-h-[90vh] object-contain"
                  />
                </div>
              </div>
            )}
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

export default CreateProduct;
