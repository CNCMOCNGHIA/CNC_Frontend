"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, RotateCcw, ExternalLink } from "lucide-react";
import AboutView from "@/components/site/AboutView";
import { getPage, updatePage, revalidatePage } from "@/services/page";
import fallbackContent from "@/default-content/gioi-thieu.json";
import {
  SectionCard,
  TextField,
  TextAreaField,
  ImageField,
  ListField,
  SelectField,
} from "./fields";

const SLUG = "gioi-thieu";

const ICON_OPTIONS = [
  { value: "award", label: "Huy chương (Award)" },
  { value: "users", label: "Người dùng (Users)" },
  { value: "target", label: "Mục tiêu (Target)" },
  { value: "factory", label: "Nhà máy (Factory)" },
];

const emptyValueItem = () => ({ icon: "award", title: "", description: "" });
const emptyMachineItem = () => ({ name: "", specs: "", quantity: "", image: "" });
const emptyFacilityItem = () => ({ title: "", description: "" });

export default function AboutEditor() {
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

  const setSection = (key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePage(SLUG, content);
      await revalidatePage(SLUG);
      setInitial(content);
      toast.success("Đã lưu trang Giới thiệu");
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

  const { hero, story, values, machinery, facility } = content;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Giới thiệu</h1>
          <p className="text-xs text-gray-500">
            {dirty ? "Có thay đổi chưa lưu" : "Đã đồng bộ"}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/gioi-thieu"
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
          <SectionCard title="Hero" description="Phần đầu trang">
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
              folder="pages/gioi-thieu"
            />
          </SectionCard>

          <SectionCard title="Câu chuyện (Story)" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={story?.title}
              onChange={(v) => setSection("story", { ...story, title: v })}
            />
            <ListField
              label="Đoạn văn"
              items={story?.paragraphs}
              onChange={(items) => setSection("story", { ...story, paragraphs: items })}
              emptyItem=""
              addLabel="Thêm đoạn"
              renderItem={(value, set) => (
                <TextAreaField value={value} onChange={set} rows={3} />
              )}
            />
            <ImageField
              label="Ảnh minh hoạ"
              value={story?.image}
              onChange={(v) => setSection("story", { ...story, image: v })}
              folder="pages/gioi-thieu"
            />
            <TextField
              label="Mô tả ảnh (alt)"
              value={story?.imageAlt}
              onChange={(v) => setSection("story", { ...story, imageAlt: v })}
            />
          </SectionCard>

          <SectionCard title="Giá trị cốt lõi (Values)" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={values?.title}
              onChange={(v) => setSection("values", { ...values, title: v })}
            />
            <TextAreaField
              label="Mô tả"
              value={values?.description}
              onChange={(v) => setSection("values", { ...values, description: v })}
            />
            <ListField
              label="Danh sách giá trị"
              items={values?.items}
              onChange={(items) => setSection("values", { ...values, items })}
              emptyItem={emptyValueItem}
              addLabel="Thêm giá trị"
              renderItem={(item, set) => (
                <div className="space-y-2">
                  <SelectField
                    label="Icon"
                    value={item.icon}
                    onChange={(v) => set({ ...item, icon: v })}
                    options={ICON_OPTIONS}
                  />
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

          <SectionCard title="Máy móc thiết bị (Machinery)" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={machinery?.title}
              onChange={(v) => setSection("machinery", { ...machinery, title: v })}
            />
            <TextAreaField
              label="Mô tả"
              value={machinery?.description}
              onChange={(v) => setSection("machinery", { ...machinery, description: v })}
            />
            <ListField
              label="Danh sách máy"
              items={machinery?.items}
              onChange={(items) => setSection("machinery", { ...machinery, items })}
              emptyItem={emptyMachineItem}
              addLabel="Thêm máy"
              renderItem={(item, set) => (
                <div className="space-y-2">
                  <TextField
                    label="Tên máy"
                    value={item.name}
                    onChange={(v) => set({ ...item, name: v })}
                  />
                  <TextField
                    label="Số lượng"
                    value={item.quantity}
                    onChange={(v) => set({ ...item, quantity: v })}
                    placeholder="VD: 8 units"
                  />
                  <TextAreaField
                    label="Thông số (specs)"
                    value={item.specs}
                    onChange={(v) => set({ ...item, specs: v })}
                    rows={2}
                  />
                  <ImageField
                    label="Ảnh"
                    value={item.image}
                    onChange={(v) => set({ ...item, image: v })}
                    folder="pages/gioi-thieu/machinery"
                  />
                </div>
              )}
            />
          </SectionCard>

          <SectionCard title="Cơ sở (Facility)" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={facility?.title}
              onChange={(v) => setSection("facility", { ...facility, title: v })}
            />
            <ImageField
              label="Ảnh"
              value={facility?.image}
              onChange={(v) => setSection("facility", { ...facility, image: v })}
              folder="pages/gioi-thieu"
            />
            <TextField
              label="Mô tả ảnh (alt)"
              value={facility?.imageAlt}
              onChange={(v) => setSection("facility", { ...facility, imageAlt: v })}
            />
            <ListField
              label="Danh sách điểm nổi bật"
              items={facility?.items}
              onChange={(items) => setSection("facility", { ...facility, items })}
              emptyItem={emptyFacilityItem}
              addLabel="Thêm điểm"
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
        </div>

        <div className="overflow-y-auto bg-gray-100">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 text-xs text-gray-500">
            Xem trước (cuộn để xem toàn bộ)
          </div>
          <div className="origin-top-left">
            <AboutView content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
