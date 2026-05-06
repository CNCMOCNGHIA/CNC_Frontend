"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, Upload, X } from "lucide-react";
import { uploadImage } from "@/services/upload";

export function SectionCard({ title, description, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-md border border-gray-200 mb-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
        {open ? (
          <ChevronUp size={16} className="text-gray-500" />
        ) : (
          <ChevronDown size={16} className="text-gray-500" />
        )}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

export function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-xs font-medium text-gray-700 mb-1">{label}</span>
      )}
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

export function TextAreaField({ label, value, onChange, rows = 3, placeholder }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-xs font-medium text-gray-700 mb-1">{label}</span>
      )}
      <textarea
        rows={rows}
        className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-xs font-medium text-gray-700 mb-1">{label}</span>
      )}
      <select
        className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ImageField({ label, value, onChange, folder = "pages" }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Tải ảnh lên thất bại");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      {label && (
        <span className="block text-xs font-medium text-gray-700 mb-1">{label}</span>
      )}
      <div className="flex gap-3 items-start">
        <div className="w-32 h-20 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
              Chưa có ảnh
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="URL ảnh hoặc đường dẫn tương đối (vd: /images/x.jpeg)"
          />
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-medium text-gray-700 cursor-pointer">
            <Upload size={14} />
            {uploading ? "Đang tải..." : "Tải ảnh lên"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
              disabled={uploading}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export function LinkField({ label, value, onChange }) {
  const v = value ?? { label: "", href: "" };
  return (
    <div>
      {label && (
        <span className="block text-xs font-medium text-gray-700 mb-1">{label}</span>
      )}
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={v.label ?? ""}
          onChange={(e) => onChange({ ...v, label: e.target.value })}
          placeholder="Nhãn hiển thị"
        />
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={v.href ?? ""}
          onChange={(e) => onChange({ ...v, href: e.target.value })}
          placeholder="Đường dẫn (vd: /dich-vu)"
        />
      </div>
    </div>
  );
}

export function ListField({ label, items, onChange, renderItem, emptyItem, addLabel = "Thêm mục" }) {
  const list = items ?? [];

  const updateItem = (index, next) => {
    const copy = [...list];
    copy[index] = next;
    onChange(copy);
  };
  const removeItem = (index) => {
    onChange(list.filter((_, i) => i !== index));
  };
  const addItem = () => {
    onChange([...list, typeof emptyItem === "function" ? emptyItem() : emptyItem]);
  };

  return (
    <div>
      {label && (
        <span className="block text-xs font-medium text-gray-700 mb-2">{label}</span>
      )}
      <div className="space-y-2">
        {list.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-200 rounded-md p-3 relative"
          >
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"
              title="Xoá"
            >
              <X size={14} />
            </button>
            <div className="text-xs text-gray-500 mb-2">#{index + 1}</div>
            {renderItem(item, (next) => updateItem(index, next))}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-xs font-medium"
      >
        <Plus size={14} />
        {addLabel}
      </button>
    </div>
  );
}

export function StringListField({ label, items, onChange, placeholder, addLabel = "Thêm dòng" }) {
  return (
    <ListField
      label={label}
      items={items}
      onChange={onChange}
      addLabel={addLabel}
      emptyItem=""
      renderItem={(value, setValue) => (
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value ?? ""}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
      )}
    />
  );
}
