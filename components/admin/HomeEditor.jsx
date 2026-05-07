"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, RotateCcw, ExternalLink } from "lucide-react";
import HomeView from "@/components/site/HomeView";
import { getPage, updatePage, revalidatePage } from "@/services/page";
import fallbackContent from "@/default-content/trang-chu.json";
import {
  SectionCard,
  TextField,
  TextAreaField,
  ImageField,
  LinkField,
  ListField,
  StringListField,
} from "./fields";

const SLUG = "trang-chu";

const emptyImageItem = () => ({ name: "", image: "", href: "" });
const emptyServiceItem = () => ({ title: "", description: "", image: "" });
const emptyStatItem = () => ({ number: "", label: "" });

export default function HomeEditor() {
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
      toast.success("Đã lưu trang chủ");
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

  const { hero, hotProducts, stats, servicesSection, panelSamples, customerProducts, whyChooseUs, cta } = content;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Trang chủ</h1>
          <p className="text-xs text-gray-500">
            {dirty ? "Có thay đổi chưa lưu" : "Đã đồng bộ"}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/"
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
          <SectionCard title="Hero" description="Phần đầu trang với tiêu đề lớn và 2 nút CTA">
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
            <LinkField
              label="Nút chính (Primary CTA)"
              value={hero?.primaryCta}
              onChange={(v) => setSection("hero", { ...hero, primaryCta: v })}
            />
            <LinkField
              label="Nút phụ (Secondary CTA)"
              value={hero?.secondaryCta}
              onChange={(v) => setSection("hero", { ...hero, secondaryCta: v })}
            />
          </SectionCard>

          <SectionCard title="Sản phẩm HOT" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={hotProducts?.title}
              onChange={(v) => setSection("hotProducts", { ...hotProducts, title: v })}
            />
            <TextAreaField
              label="Mô tả"
              value={hotProducts?.description}
              onChange={(v) => setSection("hotProducts", { ...hotProducts, description: v })}
            />
            <ListField
              label="Danh sách sản phẩm"
              items={hotProducts?.items}
              onChange={(items) => setSection("hotProducts", { ...hotProducts, items })}
              emptyItem={emptyImageItem}
              addLabel="Thêm sản phẩm"
              renderItem={(item, set) => (
                <div className="space-y-2">
                  <TextField
                    label="Tên"
                    value={item.name}
                    onChange={(v) => set({ ...item, name: v })}
                  />
                  <ImageField
                    label="Ảnh"
                    value={item.image}
                    onChange={(v) => set({ ...item, image: v })}
                  />
                  <TextField
                    label="Liên kết (tuỳ chọn)"
                    value={item.href}
                    onChange={(v) => set({ ...item, href: v })}
                    placeholder="/san-pham/..."
                  />
                </div>
              )}
            />
          </SectionCard>

          <SectionCard title="Số liệu (Stats)" defaultOpen={false}>
            <ListField
              items={stats}
              onChange={(items) => setSection("stats", items)}
              emptyItem={emptyStatItem}
              addLabel="Thêm số liệu"
              renderItem={(item, set) => (
                <div className="grid grid-cols-2 gap-2">
                  <TextField
                    label="Số"
                    value={item.number}
                    onChange={(v) => set({ ...item, number: v })}
                  />
                  <TextField
                    label="Nhãn"
                    value={item.label}
                    onChange={(v) => set({ ...item, label: v })}
                  />
                </div>
              )}
            />
          </SectionCard>

          <SectionCard title="Dịch vụ" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={servicesSection?.title}
              onChange={(v) => setSection("servicesSection", { ...servicesSection, title: v })}
            />
            <TextAreaField
              label="Mô tả"
              value={servicesSection?.description}
              onChange={(v) => setSection("servicesSection", { ...servicesSection, description: v })}
            />
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Nhãn 'Tìm hiểu thêm'"
                value={servicesSection?.learnMoreLabel}
                onChange={(v) => setSection("servicesSection", { ...servicesSection, learnMoreLabel: v })}
              />
              <TextField
                label="Liên kết 'Tìm hiểu thêm'"
                value={servicesSection?.learnMoreHref}
                onChange={(v) => setSection("servicesSection", { ...servicesSection, learnMoreHref: v })}
              />
            </div>
            <ListField
              label="Danh sách dịch vụ"
              items={servicesSection?.items}
              onChange={(items) => setSection("servicesSection", { ...servicesSection, items })}
              emptyItem={emptyServiceItem}
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
                    rows={2}
                  />
                  <ImageField
                    label="Ảnh"
                    value={item.image}
                    onChange={(v) => set({ ...item, image: v })}
                  />
                </div>
              )}
            />
          </SectionCard>

          <SectionCard title="Mẫu ván gia công" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={panelSamples?.title}
              onChange={(v) => setSection("panelSamples", { ...panelSamples, title: v })}
            />
            <TextAreaField
              label="Mô tả"
              value={panelSamples?.description}
              onChange={(v) => setSection("panelSamples", { ...panelSamples, description: v })}
            />
            <ListField
              label="Danh sách mẫu"
              items={panelSamples?.items}
              onChange={(items) => setSection("panelSamples", { ...panelSamples, items })}
              emptyItem={emptyImageItem}
              addLabel="Thêm mẫu"
              renderItem={(item, set) => (
                <div className="space-y-2">
                  <TextField label="Tên" value={item.name} onChange={(v) => set({ ...item, name: v })} />
                  <ImageField
                    label="Ảnh"
                    value={item.image}
                    onChange={(v) => set({ ...item, image: v })}
                  />
                  <TextField
                    label="Liên kết (tuỳ chọn)"
                    value={item.href}
                    onChange={(v) => set({ ...item, href: v })}
                  />
                </div>
              )}
            />
          </SectionCard>

          <SectionCard title="Sản phẩm khách hàng" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={customerProducts?.title}
              onChange={(v) => setSection("customerProducts", { ...customerProducts, title: v })}
            />
            <TextAreaField
              label="Mô tả"
              value={customerProducts?.description}
              onChange={(v) => setSection("customerProducts", { ...customerProducts, description: v })}
            />
            <ListField
              label="Danh sách sản phẩm"
              items={customerProducts?.items}
              onChange={(items) => setSection("customerProducts", { ...customerProducts, items })}
              emptyItem={emptyImageItem}
              addLabel="Thêm sản phẩm"
              renderItem={(item, set) => (
                <div className="space-y-2">
                  <TextField label="Tên" value={item.name} onChange={(v) => set({ ...item, name: v })} />
                  <ImageField
                    label="Ảnh"
                    value={item.image}
                    onChange={(v) => set({ ...item, image: v })}
                  />
                  <TextField
                    label="Liên kết (tuỳ chọn)"
                    value={item.href}
                    onChange={(v) => set({ ...item, href: v })}
                  />
                </div>
              )}
            />
          </SectionCard>

          <SectionCard title="Lý do chọn chúng tôi" defaultOpen={false}>
            <TextField
              label="Tiêu đề"
              value={whyChooseUs?.title}
              onChange={(v) => setSection("whyChooseUs", { ...whyChooseUs, title: v })}
            />
            <StringListField
              label="Danh sách lý do"
              items={whyChooseUs?.items}
              onChange={(items) => setSection("whyChooseUs", { ...whyChooseUs, items })}
              placeholder="VD: Máy CNC hiện đại"
              addLabel="Thêm lý do"
            />
            <ImageField
              label="Ảnh minh hoạ"
              value={whyChooseUs?.image}
              onChange={(v) => setSection("whyChooseUs", { ...whyChooseUs, image: v })}
            />
            <TextField
              label="Mô tả ảnh (alt)"
              value={whyChooseUs?.imageAlt}
              onChange={(v) => setSection("whyChooseUs", { ...whyChooseUs, imageAlt: v })}
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
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Nhãn nút"
                value={cta?.buttonLabel}
                onChange={(v) => setSection("cta", { ...cta, buttonLabel: v })}
              />
              <TextField
                label="Liên kết nút"
                value={cta?.buttonHref}
                onChange={(v) => setSection("cta", { ...cta, buttonHref: v })}
              />
            </div>
          </SectionCard>
        </div>

        <div className="overflow-y-auto bg-gray-100">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 text-xs text-gray-500">
            Xem trước (cuộn để xem toàn bộ)
          </div>
          <div className="origin-top-left">
            <HomeView content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
