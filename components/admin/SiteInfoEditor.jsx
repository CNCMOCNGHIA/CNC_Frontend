"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, RotateCcw, ExternalLink } from "lucide-react";
import { Layout as SiteLayout } from "@/components/layout";
import { getPage, updatePage, revalidatePage } from "@/services/page";
import fallbackContent from "@/default-content/cnc-infor.json";
import {
  SectionCard,
  TextField,
  TextAreaField,
  ListField,
  StringListField,
} from "./fields";

const SLUG = "cnc-infor";

const emptyHotline = () => ({ label: "", phone: "" });
const emptyQuickLink = () => ({ href: "", label: "" });
const emptyNavLink = () => ({ path: "", label: "", children: [] });

function NavLinkItem({ item, set, depth = 1 }) {
  const maxDepth = 3;
  const childKeySuffix = depth >= maxDepth ? "" : "(con)";
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <TextField
          label="Nhãn"
          value={item.label}
          onChange={(v) => set({ ...item, label: v })}
        />
        <TextField
          label="Đường dẫn (path)"
          value={item.path}
          onChange={(v) => set({ ...item, path: v })}
          placeholder="/san-pham"
        />
      </div>
      {depth === 1 && (
        <label className="flex items-center gap-2 text-xs text-gray-700">
          <input
            type="checkbox"
            checked={Boolean(item.featured)}
            onChange={(e) => set({ ...item, featured: e.target.checked })}
          />
          Featured (nổi bật, nền vàng)
        </label>
      )}
      {depth < maxDepth && (
        <ListField
          label={`Mục ${childKeySuffix}`}
          items={item.children}
          onChange={(children) => set({ ...item, children })}
          emptyItem={emptyNavLink}
          addLabel="Thêm mục con"
          renderItem={(child, setChild) => (
            <NavLinkItem item={child} set={setChild} depth={depth + 1} />
          )}
        />
      )}
    </div>
  );
}

export default function SiteInfoEditor() {
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
      toast.success("Đã lưu Header / Footer / Nav");
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
  const { brand, topBar, navLinks, footer, zalo } = content;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Header / Footer / Nav</h1>
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
            Mở trang chủ
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
          <SectionCard title="Brand">
            <div className="grid grid-cols-3 gap-2">
              <TextField
                label="Initials"
                value={brand?.initials}
                onChange={(v) => setSection("brand", { ...brand, initials: v })}
              />
              <div className="col-span-2">
                <TextField
                  label="Tên thương hiệu"
                  value={brand?.name}
                  onChange={(v) => setSection("brand", { ...brand, name: v })}
                />
              </div>
            </div>
            <TextField
              label="Tagline"
              value={brand?.tagline}
              onChange={(v) => setSection("brand", { ...brand, tagline: v })}
            />
          </SectionCard>

          <SectionCard title="Top bar" defaultOpen={false}>
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Phone"
                value={topBar?.phone}
                onChange={(v) => setSection("topBar", { ...topBar, phone: v })}
              />
              <TextField
                label="Email"
                value={topBar?.email}
                onChange={(v) => setSection("topBar", { ...topBar, email: v })}
              />
            </div>
            <TextField
              label="Giờ làm việc"
              value={topBar?.workingHours}
              onChange={(v) => setSection("topBar", { ...topBar, workingHours: v })}
            />
            <TextField
              label="Placeholder ô tìm kiếm"
              value={topBar?.searchPlaceholder}
              onChange={(v) => setSection("topBar", { ...topBar, searchPlaceholder: v })}
            />
            <ListField
              label="Hotlines"
              items={topBar?.hotlines}
              onChange={(items) => setSection("topBar", { ...topBar, hotlines: items })}
              emptyItem={emptyHotline}
              addLabel="Thêm hotline"
              renderItem={(item, set) => (
                <div className="grid grid-cols-2 gap-2">
                  <TextField
                    label="Nhãn"
                    value={item.label}
                    onChange={(v) => set({ ...item, label: v })}
                  />
                  <TextField
                    label="Số điện thoại"
                    value={item.phone}
                    onChange={(v) => set({ ...item, phone: v })}
                  />
                </div>
              )}
            />
          </SectionCard>

          <SectionCard title="Menu điều hướng (Navigation)" defaultOpen={false}>
            <div className="text-xs text-gray-500 mb-2">
              Hỗ trợ tối đa 3 cấp menu. Đánh dấu Featured để mục có nền vàng nổi bật.
            </div>
            <ListField
              items={navLinks}
              onChange={(items) => setSection("navLinks", items)}
              emptyItem={emptyNavLink}
              addLabel="Thêm mục menu"
              renderItem={(item, set) => <NavLinkItem item={item} set={set} depth={1} />}
            />
          </SectionCard>

          <SectionCard title="Footer" defaultOpen={false}>
            <TextAreaField
              label="Mô tả công ty"
              value={footer?.description}
              onChange={(v) => setSection("footer", { ...footer, description: v })}
              rows={3}
            />
            <div className="space-y-2 p-3 bg-white border border-gray-200 rounded-md">
              <span className="block text-xs font-semibold text-gray-700">
                Quick Links
              </span>
              <TextField
                label="Tiêu đề"
                value={footer?.quickLinks?.heading}
                onChange={(v) =>
                  setSection("footer", {
                    ...footer,
                    quickLinks: { ...footer?.quickLinks, heading: v },
                  })
                }
              />
              <ListField
                label="Liên kết"
                items={footer?.quickLinks?.items}
                onChange={(items) =>
                  setSection("footer", {
                    ...footer,
                    quickLinks: { ...footer?.quickLinks, items },
                  })
                }
                emptyItem={emptyQuickLink}
                addLabel="Thêm liên kết"
                renderItem={(item, set) => (
                  <div className="grid grid-cols-2 gap-2">
                    <TextField
                      label="Nhãn"
                      value={item.label}
                      onChange={(v) => set({ ...item, label: v })}
                    />
                    <TextField
                      label="URL"
                      value={item.href}
                      onChange={(v) => set({ ...item, href: v })}
                    />
                  </div>
                )}
              />
            </div>

            <div className="space-y-2 p-3 bg-white border border-gray-200 rounded-md">
              <span className="block text-xs font-semibold text-gray-700">Contact</span>
              <TextField
                label="Tiêu đề"
                value={footer?.contact?.heading}
                onChange={(v) =>
                  setSection("footer", {
                    ...footer,
                    contact: { ...footer?.contact, heading: v },
                  })
                }
              />
              <StringListField
                label="Các dòng thông tin"
                items={footer?.contact?.items}
                onChange={(items) =>
                  setSection("footer", {
                    ...footer,
                    contact: { ...footer?.contact, items },
                  })
                }
                placeholder="VD: Phone: 0123 456 789"
                addLabel="Thêm dòng"
              />
            </div>

            <TextField
              label="Copyright"
              value={footer?.copyright}
              onChange={(v) => setSection("footer", { ...footer, copyright: v })}
            />
          </SectionCard>

          <SectionCard title="Zalo" defaultOpen={false}>
            <TextField
              label="Liên kết Zalo"
              value={zalo?.href}
              onChange={(v) => setSection("zalo", { ...zalo, href: v })}
            />
          </SectionCard>
        </div>

        <div className="overflow-y-auto bg-gray-100">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 text-xs text-gray-500">
            Xem trước (header + footer)
          </div>
          <div className="bg-[#2B2B2B]">
            <SiteLayout content={content}>
              <div className="min-h-[200px] p-8 text-center text-white/50">
                (Nội dung trang sẽ hiển thị tại đây)
              </div>
            </SiteLayout>
          </div>
        </div>
      </div>
    </div>
  );
}
