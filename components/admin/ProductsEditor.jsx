"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, RotateCcw, ExternalLink } from "lucide-react";
import ProductsView from "@/components/site/ProductsView";
import { getPage, updatePage, revalidatePage } from "@/services/page";
import fallbackContent from "@/default-content/san-pham.json";
import {
  SectionCard,
  TextField,
  TextAreaField,
  ImageField,
  ListField,
  StringListField,
} from "./fields";

const SLUG = "san-pham";

const emptyCapability = () => ({ title: "", items: [] });

export default function ProductsEditor() {
  const [content, setContent] = useState(fallbackContent);
  const [initial, setInitial] = useState(fallbackContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getPage(SLUG, { fallback: fallbackContent });
        if (cancelled) return;
        const fetched = result?.data?.content ?? fallbackContent;
        setContent(fetched);
        setInitial(fetched);
      } catch {
        toast.error("Không tải được nội dung trang");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setSection = (key, value) => setContent((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePage(SLUG, content);
      await revalidatePage(SLUG);
      setInitial(content);
      toast.success("Đã lưu trang Sản phẩm");
    } catch {
      toast.error("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm("Khôi phục về nội dung đã lưu lần cuối?")) return;
    setContent(initial);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Đang tải...
      </div>
    );
  }

  const dirty = JSON.stringify(content) !== JSON.stringify(initial);
  const { hero, capabilities, customQuoteCta } = content;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Sản phẩm</h1>
          <p className="text-xs text-gray-500">
            {dirty ? "Có thay đổi chưa lưu" : "Đã đồng bộ"}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/san-pham"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
          >
            <ExternalLink size={14} />
            Mở trang
          </a>
          <button
            type="button"
            onClick={handleReset}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw size={14} />
            Hoàn tác
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={14} />
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        <div className="overflow-y-auto p-4 bg-gray-50 border-r border-gray-200">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-800">
            Lưu ý: Danh sách sản phẩm và bộ lọc danh mục được lấy từ backend (không sửa
            ở đây). Trang này chỉ chỉnh phần Hero, Năng lực sản xuất, và CTA cuối trang.
          </div>

          <SectionCard title="Hero">
            <TextField
              label="Tiêu đề"
              value={hero?.title}
              onChange={(v) => setSection("hero", { ...hero, title: v })}
            />
            <TextAreaField
              label="Mô tả"
              value={hero?.description}
              onChange={(v) => setSection("hero", { ...hero, description: v })}
            />
            <ImageField
              label="Ảnh nền"
              value={hero?.backgroundImage}
              onChange={(v) => setSection("hero", { ...hero, backgroundImage: v })}
              folder="pages/san-pham"
            />
          </SectionCard>

          <SectionCard title="Năng lực sản xuất" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={capabilities?.title}
              onChange={(v) => setSection("capabilities", { ...capabilities, title: v })}
            />
            <TextAreaField
              label="Mô tả"
              value={capabilities?.description}
              onChange={(v) => setSection("capabilities", { ...capabilities, description: v })}
            />
            <ListField
              label="Danh sách năng lực"
              items={capabilities?.items}
              onChange={(items) => setSection("capabilities", { ...capabilities, items })}
              emptyItem={emptyCapability}
              addLabel="Thêm nhóm"
              renderItem={(item, set) => (
                <div className="space-y-2">
                  <TextField
                    label="Tiêu đề nhóm"
                    value={item.title}
                    onChange={(v) => set({ ...item, title: v })}
                  />
                  <StringListField
                    label="Các mục"
                    items={item.items}
                    onChange={(items) => set({ ...item, items })}
                    placeholder="VD: MDF"
                    addLabel="Thêm mục"
                  />
                </div>
              )}
            />
          </SectionCard>

          <SectionCard title="CTA cuối trang" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={customQuoteCta?.title}
              onChange={(v) => setSection("customQuoteCta", { ...customQuoteCta, title: v })}
            />
            <TextAreaField
              label="Mô tả"
              value={customQuoteCta?.description}
              onChange={(v) => setSection("customQuoteCta", { ...customQuoteCta, description: v })}
            />
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Nhãn nút"
                value={customQuoteCta?.buttonLabel}
                onChange={(v) => setSection("customQuoteCta", { ...customQuoteCta, buttonLabel: v })}
              />
              <TextField
                label="Liên kết nút"
                value={customQuoteCta?.buttonHref}
                onChange={(v) => setSection("customQuoteCta", { ...customQuoteCta, buttonHref: v })}
              />
            </div>
          </SectionCard>
        </div>

        <div className="overflow-y-auto bg-gray-100">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 text-xs text-gray-500">
            Xem trước
          </div>
          <ProductsView content={content} />
        </div>
      </div>
    </div>
  );
}
