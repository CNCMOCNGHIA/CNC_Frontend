"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, RotateCcw, ExternalLink } from "lucide-react";
import ContactView from "@/components/site/ContactView";
import { getPage, updatePage, revalidatePage } from "@/services/page";
import fallbackContent from "@/default-content/lien-he.json";
import {
  SectionCard,
  TextField,
  TextAreaField,
  ImageField,
  ListField,
  StringListField,
  SelectField,
} from "./fields";

const SLUG = "lien-he";

const ICON_OPTIONS = [
  { value: "MapPin", label: "Map Pin (Địa chỉ)" },
  { value: "Phone", label: "Phone (Điện thoại)" },
  { value: "Mail", label: "Mail (Email)" },
  { value: "Clock", label: "Clock (Giờ làm)" },
];

const TYPE_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Tel (SĐT)" },
  { value: "select", label: "Select" },
  { value: "textarea", label: "Textarea" },
];

const emptyContactItem = () => ({ icon: "MapPin", title: "", details: [] });
const emptyOption = () => ({ value: "", label: "" });
const emptyField = () => ({
  id: "",
  type: "text",
  label: "",
  placeholder: "",
  required: false,
});
const emptyInfoCard = () => ({ title: "", description: "" });

export default function ContactEditor() {
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
      toast.success("Đã lưu trang Liên hệ");
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
  const { hero, contactInfo, quickContact, contactForm, map, infoCards } = content;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Liên hệ</h1>
          <p className="text-xs text-gray-500">
            {dirty ? "Có thay đổi chưa lưu" : "Đã đồng bộ"}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/lien-he"
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
              label="Phụ đề"
              value={hero?.subtitle}
              onChange={(v) => setSection("hero", { ...hero, subtitle: v })}
            />
            <ImageField
              label="Ảnh nền"
              value={hero?.backgroundImage}
              onChange={(v) => setSection("hero", { ...hero, backgroundImage: v })}
              folder="pages/lien-he"
            />
          </SectionCard>

          <SectionCard title="Thông tin liên hệ" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={contactInfo?.heading}
              onChange={(v) => setSection("contactInfo", { ...contactInfo, heading: v })}
            />
            <TextAreaField
              label="Mô tả"
              value={contactInfo?.description}
              onChange={(v) => setSection("contactInfo", { ...contactInfo, description: v })}
            />
            <ListField
              label="Danh sách thông tin"
              items={contactInfo?.items}
              onChange={(items) =>
                setSection("contactInfo", { ...contactInfo, items })
              }
              emptyItem={emptyContactItem}
              addLabel="Thêm thông tin"
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
                  <StringListField
                    label="Chi tiết (mỗi dòng 1 mục)"
                    items={item.details}
                    onChange={(details) => set({ ...item, details })}
                    placeholder="VD: 0123 456 789"
                    addLabel="Thêm dòng"
                  />
                </div>
              )}
            />
          </SectionCard>

          <SectionCard title="Liên hệ nhanh (Zalo)" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={quickContact?.heading}
              onChange={(v) => setSection("quickContact", { ...quickContact, heading: v })}
            />
            <TextAreaField
              label="Mô tả"
              value={quickContact?.description}
              onChange={(v) =>
                setSection("quickContact", { ...quickContact, description: v })
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Nhãn nút"
                value={quickContact?.zalo?.label}
                onChange={(v) =>
                  setSection("quickContact", {
                    ...quickContact,
                    zalo: { ...quickContact?.zalo, label: v },
                  })
                }
              />
              <TextField
                label="Liên kết Zalo"
                value={quickContact?.zalo?.href}
                onChange={(v) =>
                  setSection("quickContact", {
                    ...quickContact,
                    zalo: { ...quickContact?.zalo, href: v },
                  })
                }
              />
            </div>
          </SectionCard>

          <SectionCard title="Form liên hệ" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={contactForm?.heading}
              onChange={(v) => setSection("contactForm", { ...contactForm, heading: v })}
            />
            <ListField
              label="Trường form"
              items={contactForm?.fields}
              onChange={(fields) =>
                setSection("contactForm", { ...contactForm, fields })
              }
              emptyItem={emptyField}
              addLabel="Thêm trường"
              renderItem={(item, set) => (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <TextField
                      label="ID"
                      value={item.id}
                      onChange={(v) => set({ ...item, id: v })}
                    />
                    <SelectField
                      label="Loại"
                      value={item.type}
                      onChange={(v) => set({ ...item, type: v })}
                      options={TYPE_OPTIONS}
                    />
                  </div>
                  <TextField
                    label="Nhãn"
                    value={item.label}
                    onChange={(v) => set({ ...item, label: v })}
                  />
                  <TextField
                    label="Placeholder"
                    value={item.placeholder}
                    onChange={(v) => set({ ...item, placeholder: v })}
                  />
                  <label className="flex items-center gap-2 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(item.required)}
                      onChange={(e) => set({ ...item, required: e.target.checked })}
                    />
                    Bắt buộc
                  </label>
                  {item.type === "select" && (
                    <ListField
                      label="Lựa chọn"
                      items={item.options}
                      onChange={(options) => set({ ...item, options })}
                      emptyItem={emptyOption}
                      addLabel="Thêm lựa chọn"
                      renderItem={(opt, setOpt) => (
                        <div className="grid grid-cols-2 gap-2">
                          <TextField
                            label="Value"
                            value={opt.value}
                            onChange={(x) => setOpt({ ...opt, value: x })}
                          />
                          <TextField
                            label="Hiển thị"
                            value={opt.label}
                            onChange={(x) => setOpt({ ...opt, label: x })}
                          />
                        </div>
                      )}
                    />
                  )}
                </div>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Nhãn nút gửi"
                value={contactForm?.submitButton?.label}
                onChange={(v) =>
                  setSection("contactForm", {
                    ...contactForm,
                    submitButton: { ...contactForm?.submitButton, label: v },
                  })
                }
              />
              <TextField
                label="Nhãn khi đang gửi"
                value={contactForm?.submitButton?.loadingLabel}
                onChange={(v) =>
                  setSection("contactForm", {
                    ...contactForm,
                    submitButton: { ...contactForm?.submitButton, loadingLabel: v },
                  })
                }
              />
            </div>
            <TextAreaField
              label="Thông báo gửi thành công"
              value={contactForm?.successMessage}
              onChange={(v) =>
                setSection("contactForm", { ...contactForm, successMessage: v })
              }
              rows={2}
            />
          </SectionCard>

          <SectionCard title="Bản đồ" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={map?.heading}
              onChange={(v) => setSection("map", { ...map, heading: v })}
            />
            <TextAreaField
              label="Mô tả"
              value={map?.description}
              onChange={(v) => setSection("map", { ...map, description: v })}
            />
            <TextField
              label="Địa chỉ"
              value={map?.address}
              onChange={(v) => setSection("map", { ...map, address: v })}
            />
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Nhãn nút Google Maps"
                value={map?.googleMapsLabel}
                onChange={(v) => setSection("map", { ...map, googleMapsLabel: v })}
              />
              <TextField
                label="Liên kết Google Maps"
                value={map?.googleMapsHref}
                onChange={(v) => setSection("map", { ...map, googleMapsHref: v })}
              />
            </div>
          </SectionCard>

          <SectionCard title="Thẻ thông tin (Info Cards)" defaultOpen={false}>
            <ListField
              items={infoCards}
              onChange={(items) => setSection("infoCards", items)}
              emptyItem={emptyInfoCard}
              addLabel="Thêm thẻ"
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
          <ContactView content={content} />
        </div>
      </div>
    </div>
  );
}
