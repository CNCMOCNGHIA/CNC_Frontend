"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, RotateCcw, ExternalLink } from "lucide-react";
import BlogView from "@/components/site/BlogView";
import { getPage, updatePage, revalidatePage } from "@/services/page";
import fallbackContent from "@/default-content/tin-tuc.json";
import {
  SectionCard,
  TextField,
  TextAreaField,
  ImageField,
  StringListField,
} from "./fields";

const SLUG = "tin-tuc";

export default function BlogEditor() {
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

  const setField = (key, value) => setContent((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePage(SLUG, content);
      await revalidatePage(SLUG);
      setInitial(content);
      toast.success("Đã lưu trang Tin tức");
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
  const { hero, categories, featuredLabel, readMoreLabel } = content;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Tin tức</h1>
          <p className="text-xs text-gray-500">
            {dirty ? "Có thay đổi chưa lưu" : "Đã đồng bộ"}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/tin-tuc"
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
            Lưu ý: Danh sách bài viết được quản lý qua menu "Bài Đăng". Trang này chỉ
            chỉnh phần Hero, danh mục và nhãn UI.
          </div>

          <SectionCard title="Hero">
            <TextField
              label="Tiêu đề"
              value={hero?.title}
              onChange={(v) => setField("hero", { ...hero, title: v })}
            />
            <TextAreaField
              label="Mô tả"
              value={hero?.description}
              onChange={(v) => setField("hero", { ...hero, description: v })}
            />
            <ImageField
              label="Ảnh nền"
              value={hero?.backgroundImage}
              onChange={(v) => setField("hero", { ...hero, backgroundImage: v })}
            />
          </SectionCard>

          <SectionCard title="Danh mục" defaultOpen={false}>
            <StringListField
              label="Danh sách danh mục"
              items={categories}
              onChange={(items) => setField("categories", items)}
              placeholder="VD: Manufacturing"
              addLabel="Thêm danh mục"
            />
          </SectionCard>

          <SectionCard title="Nhãn UI" defaultOpen={false}>
            <TextField
              label="Nhãn 'Bài nổi bật'"
              value={featuredLabel}
              onChange={(v) => setField("featuredLabel", v)}
            />
            <TextField
              label="Nhãn 'Đọc tiếp'"
              value={readMoreLabel}
              onChange={(v) => setField("readMoreLabel", v)}
            />
          </SectionCard>
        </div>

        <div className="overflow-y-auto bg-gray-100">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 text-xs text-gray-500">
            Xem trước
          </div>
          <BlogView content={content} />
        </div>
      </div>
    </div>
  );
}
