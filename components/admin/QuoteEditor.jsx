"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, RotateCcw, ExternalLink } from "lucide-react";
import QuoteView from "@/components/site/QuoteView";
import { getPage, updatePage, revalidatePage } from "@/services/page";
import fallbackContent from "@/default-content/gia-cong.json";
import {
  SectionCard,
  TextField,
  TextAreaField,
  ImageField,
  ListField,
} from "./fields";

const SLUG = "gia-cong";

const emptyOption = () => ({ value: "", label: "" });
const emptyFormat = () => ({ ext: "", desc: "" });
const emptyBenefit = () => ({ title: "", description: "" });

function FieldLabelEditor({ label, value, onChange, withRequired = true }) {
  const v = value ?? {};
  return (
    <div className="space-y-2">
      <span className="block text-xs font-medium text-gray-700">{label}</span>
      <TextField
        label="Nhãn (label)"
        value={v.label}
        onChange={(x) => onChange({ ...v, label: x })}
      />
      <TextField
        label="Placeholder"
        value={v.placeholder}
        onChange={(x) => onChange({ ...v, placeholder: x })}
      />
    </div>
  );
}

export default function QuoteEditor() {
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
      toast.success("Đã lưu trang Gia công");
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
  const { hero, contactSection, projectSection, uploadSection, submitSection, benefitsSection } = content;

  const setField = (section, fieldKey, next) =>
    setSection(section, {
      ...content[section],
      fields: { ...content[section].fields, [fieldKey]: next },
    });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Gia công</h1>
          <p className="text-xs text-gray-500">
            {dirty ? "Có thay đổi chưa lưu" : "Đã đồng bộ"}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/gia-cong"
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

          <SectionCard title="Phần Liên hệ" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={contactSection?.title}
              onChange={(v) => setSection("contactSection", { ...contactSection, title: v })}
            />
            <FieldLabelEditor
              label="Trường: Họ tên"
              value={contactSection?.fields?.name}
              onChange={(v) => setField("contactSection", "name", v)}
            />
            <FieldLabelEditor
              label="Trường: SĐT"
              value={contactSection?.fields?.phone}
              onChange={(v) => setField("contactSection", "phone", v)}
            />
            <FieldLabelEditor
              label="Trường: Email"
              value={contactSection?.fields?.email}
              onChange={(v) => setField("contactSection", "email", v)}
            />
          </SectionCard>

          <SectionCard title="Phần Dự án" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={projectSection?.title}
              onChange={(v) => setSection("projectSection", { ...projectSection, title: v })}
            />
            <div className="space-y-2">
              <span className="block text-xs font-medium text-gray-700">Trường: Vật liệu</span>
              <TextField
                label="Nhãn"
                value={projectSection?.fields?.material?.label}
                onChange={(v) =>
                  setField("projectSection", "material", {
                    ...projectSection.fields.material,
                    label: v,
                  })
                }
              />
              <ListField
                label="Lựa chọn vật liệu"
                items={projectSection?.fields?.material?.options}
                onChange={(options) =>
                  setField("projectSection", "material", {
                    ...projectSection.fields.material,
                    options,
                  })
                }
                emptyItem={emptyOption}
                addLabel="Thêm lựa chọn"
                renderItem={(item, set) => (
                  <div className="grid grid-cols-2 gap-2">
                    <TextField
                      label="Value"
                      value={item.value}
                      onChange={(x) => set({ ...item, value: x })}
                    />
                    <TextField
                      label="Hiển thị"
                      value={item.label}
                      onChange={(x) => set({ ...item, label: x })}
                    />
                  </div>
                )}
              />
            </div>

            <FieldLabelEditor
              label="Trường: Số lượng"
              value={projectSection?.fields?.quantity}
              onChange={(v) => setField("projectSection", "quantity", v)}
            />

            <div className="space-y-2">
              <span className="block text-xs font-medium text-gray-700">Trường: Thời gian giao</span>
              <TextField
                label="Nhãn"
                value={projectSection?.fields?.deliveryTime?.label}
                onChange={(v) =>
                  setField("projectSection", "deliveryTime", {
                    ...projectSection.fields.deliveryTime,
                    label: v,
                  })
                }
              />
              <ListField
                label="Lựa chọn thời gian"
                items={projectSection?.fields?.deliveryTime?.options}
                onChange={(options) =>
                  setField("projectSection", "deliveryTime", {
                    ...projectSection.fields.deliveryTime,
                    options,
                  })
                }
                emptyItem={emptyOption}
                addLabel="Thêm lựa chọn"
                renderItem={(item, set) => (
                  <div className="grid grid-cols-2 gap-2">
                    <TextField
                      label="Value"
                      value={item.value}
                      onChange={(x) => set({ ...item, value: x })}
                    />
                    <TextField
                      label="Hiển thị"
                      value={item.label}
                      onChange={(x) => set({ ...item, label: x })}
                    />
                  </div>
                )}
              />
            </div>

            <FieldLabelEditor
              label="Trường: Ghi chú"
              value={projectSection?.fields?.notes}
              onChange={(v) => setField("projectSection", "notes", v)}
            />
          </SectionCard>

          <SectionCard title="Phần Tải file" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={uploadSection?.title}
              onChange={(v) => setSection("uploadSection", { ...uploadSection, title: v })}
            />
            <TextField
              label="Nội dung kéo thả"
              value={uploadSection?.dragText}
              onChange={(v) => setSection("uploadSection", { ...uploadSection, dragText: v })}
            />
            <TextField
              label="Ghi chú định dạng"
              value={uploadSection?.formatNote}
              onChange={(v) => setSection("uploadSection", { ...uploadSection, formatNote: v })}
            />
            <TextField
              label="Nhãn nút chọn file"
              value={uploadSection?.selectButtonLabel}
              onChange={(v) => setSection("uploadSection", { ...uploadSection, selectButtonLabel: v })}
            />
            <TextField
              label="Nhãn 'File đã tải'"
              value={uploadSection?.uploadedFilesLabel}
              onChange={(v) => setSection("uploadSection", { ...uploadSection, uploadedFilesLabel: v })}
            />
            <TextField
              label="Nhãn 'Xoá'"
              value={uploadSection?.removeLabel}
              onChange={(v) => setSection("uploadSection", { ...uploadSection, removeLabel: v })}
            />
            <ListField
              label="Định dạng được chấp nhận"
              items={uploadSection?.acceptedFormats}
              onChange={(items) =>
                setSection("uploadSection", { ...uploadSection, acceptedFormats: items })
              }
              emptyItem={emptyFormat}
              addLabel="Thêm định dạng"
              renderItem={(item, set) => (
                <div className="grid grid-cols-3 gap-2">
                  <TextField
                    label="Ext"
                    value={item.ext}
                    onChange={(x) => set({ ...item, ext: x })}
                  />
                  <div className="col-span-2">
                    <TextField
                      label="Mô tả"
                      value={item.desc}
                      onChange={(x) => set({ ...item, desc: x })}
                    />
                  </div>
                </div>
              )}
            />
          </SectionCard>

          <SectionCard title="Phần Gửi" defaultOpen={false}>
            <TextField
              label="Nhãn nút gửi"
              value={submitSection?.buttonLabel}
              onChange={(v) => setSection("submitSection", { ...submitSection, buttonLabel: v })}
            />
            <TextField
              label="Nhãn khi đang gửi"
              value={submitSection?.submittingLabel}
              onChange={(v) => setSection("submitSection", { ...submitSection, submittingLabel: v })}
            />
            <TextField
              label="Ghi chú dưới nút"
              value={submitSection?.note}
              onChange={(v) => setSection("submitSection", { ...submitSection, note: v })}
            />
            <TextAreaField
              label="Thông báo gửi thành công"
              value={submitSection?.successMessage}
              onChange={(v) => setSection("submitSection", { ...submitSection, successMessage: v })}
              rows={2}
            />
          </SectionCard>

          <SectionCard title="Phần Lợi ích" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={benefitsSection?.title}
              onChange={(v) => setSection("benefitsSection", { ...benefitsSection, title: v })}
            />
            <ListField
              label="Danh sách lợi ích"
              items={benefitsSection?.items}
              onChange={(items) =>
                setSection("benefitsSection", { ...benefitsSection, items })
              }
              emptyItem={emptyBenefit}
              addLabel="Thêm lợi ích"
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
            Xem trước
          </div>
          <QuoteView content={content} />
        </div>
      </div>
    </div>
  );
}
