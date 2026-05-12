"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Star } from "lucide-react";

import "react-quill-new/dist/quill.snow.css";
import "./ProductDetail.css";
import { uploadImage } from "@/services/upload";
import { validateImage } from "@/lib/uploadValidate";
import { getCategories } from "@/services/category";
import { buildCategoryTree } from "@/lib/categoryTree";
import { getProduct, updateProduct } from "@/services/product";
import { resolveImageUrl } from "@/lib/format";
import { toYouTubeEmbedUrl } from "@/lib/youtube";

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

const ProductDetail = ({ productId, onClose }) => {
  const [productData, setProductData] = useState({
    id: "",
    title: "",
    subtitle: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });
  // thumbnailRef: { type: "url", url } | { type: "newIndex", index } | null
  const [thumbnailRef, setThumbnailRef] = useState(null);
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
  const [error, setError] = useState(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (!productId) return;

    const initialize = async () => {
      setIsLoading(true);
      try {
        const data = await getProduct(productId);
        const categoryId = data.category?.id ?? "";
        setProductData({
          id: data.id,
          title: data.title ?? "",
          subtitle: data.subtitle ?? "",
          description: data.description ?? "",
          price: data.price ?? "",
          stock: data.stock ?? "",
          categoryId,
        });
        setEditorHtml(data.description || "");
        setImages(data.images || []);
        setThumbnailRef(
          data.thumbnail ? { type: "url", url: data.thumbnail } : null
        );

        const categoryResult = await getCategories("Product");
        const categoryList = buildCategoryTree(categoryResult?.data);
        setCategories(categoryList);

        if (categoryId && categoryList.length) {
          setSelectedCategories(
            findCategoryHierarchy(categoryList, categoryId)
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
  }, [productId]);

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
      } catch (err) {
        console.error("Error uploading image:", err);
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
    setNewImages(files);
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

  const handleDeleteOldImage = (url) => {
    setImages((prev) => prev.filter((image) => image !== url));
    setThumbnailRef((prev) =>
      prev?.type === "url" && prev.url === url ? null : prev
    );
  };

  const isExistingThumb = (url) =>
    thumbnailRef?.type === "url" && thumbnailRef.url === url;
  const isNewThumb = (index) =>
    thumbnailRef?.type === "newIndex" && thumbnailRef.index === index;

  const handleSave = async () => {
    if (!productData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    const finalCategoryId =
      selectedCategories.level4?.categoryId ||
      selectedCategories.level3?.categoryId ||
      selectedCategories.level2?.categoryId ||
      productData.categoryId;
    if (!finalCategoryId) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    const priceNum = Number(productData.price);
    const stockNum = Number(productData.stock);
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
      let uploadedNewUrls = [];
      if (newImages.length > 0) {
        uploadedNewUrls = await Promise.all(
          newImages.map((image) => uploadImage(image))
        );
      }
      const finalImages = [...images, ...uploadedNewUrls];

      if (!finalImages.length) {
        toast.error("Sản phẩm phải có ít nhất 1 ảnh");
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

      await updateProduct(productData.id, {
        thumbnail,
        title: productData.title,
        subtitle: productData.subtitle || null,
        price: priceNum,
        stock: stockNum,
        description: editorHtml,
        categoryId: finalCategoryId,
        images: finalImages,
      });
      toast.success("Cập nhật sản phẩm thành công");
      onClose();
    } catch (err) {
      console.error("Error updating product:", err);
      const message = err?.messages?.[0] ?? "Failed to update product. Please try again.";
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
              className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={productData.title}
              onChange={(e) =>
                setProductData({ ...productData, title: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <h3 className="text-black text-sm font-medium mb-2">
              Phụ đề <span className="text-gray-400 font-normal">(không bắt buộc)</span>
            </h3>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={productData.subtitle}
              onChange={(e) =>
                setProductData({ ...productData, subtitle: e.target.value })
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
                className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={productData.price}
                onChange={(e) =>
                  setProductData({ ...productData, price: e.target.value })
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
                className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={productData.stock}
                onChange={(e) =>
                  setProductData({ ...productData, stock: e.target.value })
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
              Click ngôi sao để chọn ảnh đại diện (thumbnail).
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
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
                      alt={`product-${index}`}
                      className="w-full h-full object-cover"
                    />
                    {isThumb && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                        Thumbnail
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                      <button
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
                );
              })}
            </div>
          </div>

          <div className="mb-6 mt-6">
            <h3 className="text-black text-sm font-medium mb-2">
              Thêm hình ảnh
            </h3>
            <input type="file" multiple onChange={handleImageUpload} />
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
                );
              })}
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
                    ? resolveImageUrl(selectedImage)
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

export default ProductDetail;
