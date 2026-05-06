"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";

import "react-quill-new/dist/quill.snow.css";
import "./CreatePost.css";
import { uploadImage } from "@/services/upload";
import { getCategories } from "@/services/category";
import { createPost } from "@/services/post";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const CreatePost = ({ onClose }) => {
  const [images, setImages] = useState([]);
  const [editorHtml, setEditorHtml] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const quillRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await getCategories("post");
        setCategories(result.data?.[0]?.children ?? []);
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

      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);

      try {
        setIsUploading(true);
        const url = await uploadImage(file, "posts");
        quill.insertEmbed(range.index, "image", url);
        quill.setSelection(range.index + 1);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Tải ảnh lên thất bại");
      } finally {
        setIsUploading(false);
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
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

  const handleImageUpload = (event) => {
    setImages(Array.from(event.target.files));
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);
      await createPost({
        title,
        description: editorHtml,
        categoryId,
      });
      toast.success("Tạo bài đăng thành công");
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Tạo bài đăng thất bại");
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
                <input type="file" onChange={handleImageUpload} />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="h-48 overflow-hidden">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`upload-${index}`}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    </div>
                  ))}
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
