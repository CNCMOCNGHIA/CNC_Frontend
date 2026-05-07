"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, RotateCcw, ExternalLink } from "lucide-react";
import ServicesView from "@/components/site/ServicesView";
import { getPage, updatePage, revalidatePage } from "@/services/page";
import fallbackContent from "@/default-content/dich-vu.json";
import {
  SectionCard,
  TextField,
  TextAreaField,
  ImageField,
  LinkField,
  ListField,
  StringListField,
} from "./fields";

const SLUG = "dich-vu";

const emptyService = () => ({ title: "", description: "", image: "", features: [] });
const emptyAdditional = () => ({ title: "", description: "" });

export default function ServicesEditor() {
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
      } catch (error) {
        console.error("Load page failed:", error);
        toast.error("Không tải được nội dung trang");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setSection = (key, value) =>
    setContent((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePage(SLUG, content);
      await revalidatePage(SLUG);
      setInitial(content);
      toast.success("Đã lưu trang Dịch vụ");
    } catch (error) {
      console.error("Save failed:", error);
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
  const { hero, services, additionalServices, cta, requestQuoteLabel } = content;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Dịch vụ</h1>
          <p className="text-xs text-gray-500">
            {dirty ? "Có thay đổi chưa lưu" : "Đã đồng bộ"}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/dich-vu"
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
            />
          </SectionCard>

          <SectionCard title="Danh sách dịch vụ" defaultOpen={false}>
            <ListField
              items={services}
              onChange={(items) => setSection("services", items)}
              emptyItem={emptyService}
              addLabel="Thêm dịch vụ"
              renderItem={(item, set) => (
                <div className="space-y-2">
                  <TextField
                    label="Tiêu đề"
                    value={item.title}
                    onChange={(v) => set({ ...item, title: v })}
                  />
                  <TextAreaField
                    label="Mô tả"
                    value={item.description}
                    onChange={(v) => set({ ...item, description: v })}
                    rows={3}
                  />
                  <ImageField
                    label="Ảnh"
                    value={item.image}
                    onChange={(v) => set({ ...item, image: v })}
                  />
                  <StringListField
                    label="Tính năng"
                    items={item.features}
                    onChange={(features) => set({ ...item, features })}
                    placeholder="Đặc điểm dịch vụ"
                    addLabel="Thêm tính năng"
                  />
                </div>
              )}
            />
            <TextField
              label="Nhãn nút 'Yêu cầu báo giá'"
              value={requestQuoteLabel}
              onChange={(v) => setSection("requestQuoteLabel", v)}
            />
          </SectionCard>

          <SectionCard title="Dịch vụ bổ sung" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={additionalServices?.title}
              onChange={(v) => setSection("additionalServices", { ...additionalServices, title: v })}
            />
            <TextAreaField
              label="Mô tả"
              value={additionalServices?.description}
              onChange={(v) => setSection("additionalServices", { ...additionalServices, description: v })}
            />
            <ListField
              label="Danh sách"
              items={additionalServices?.items}
              onChange={(items) => setSection("additionalServices", { ...additionalServices, items })}
              emptyItem={emptyAdditional}
              addLabel="Thêm mục"
              renderItem={(item, set) => (
                <div className="space-y-2">
                  <TextField
                    label="Tiêu đề"
                    value={item.title}
                    onChange={(v) => set({ ...item, title: v })}
                  />
                  <TextAreaField
                    label="Mô tả"
                    value={item.description}
                    onChange={(v) => set({ ...item, description: v })}
                    rows={2}
                  />
                </div>
              )}
            />
          </SectionCard>

          <SectionCard title="CTA cuối trang" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={cta?.title}
              onChange={(v) => setSection("cta", { ...cta, title: v })}
            />
            <TextAreaField
              label="Mô tả"
              value={cta?.description}
              onChange={(v) => setSection("cta", { ...cta, description: v })}
            />
            <LinkField
              label="Nút chính"
              value={cta?.primaryButton}
              onChange={(v) => setSection("cta", { ...cta, primaryButton: v })}
            />
            <LinkField
              label="Nút phụ"
              value={cta?.secondaryButton}
              onChange={(v) => setSection("cta", { ...cta, secondaryButton: v })}
            />
          </SectionCard>
        </div>

        <div className="overflow-y-auto bg-gray-100">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 text-xs text-gray-500">
            Xem trước
          </div>
          <ServicesView content={content} />
        </div>
      </div>
    </div>
  );
}
