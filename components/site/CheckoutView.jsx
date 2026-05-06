"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { theme } from "@/constants/theme";
import { Breadcrumb } from "@/components/breadcrumb";
import { formatVND } from "@/lib/format";
import { useCartStore } from "@/stores/cartStore";
import { createOrder } from "@/services/order";

const STORAGE_KEY = "cnc-orders";

const rememberOrderId = (id) => {
  if (typeof window === "undefined" || !id) return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(ids)) return;
    if (!ids.includes(id)) {
      ids.unshift(id);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(0, 50)));
    }
  } catch {
    // ignore
  }
};

const PHONE_REGEX = /^(0|\+84)\d{9,10}$/;

export default function CheckoutView() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    shippingAddress: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const total = items.reduce(
    (sum, i) =>
      sum + (Number(i.snapshot?.price) || 0) * (Number(i.quantity) || 0),
    0
  );

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = "Vui lòng nhập họ tên";
    if (!form.customerPhone.trim()) {
      errs.customerPhone = "Vui lòng nhập số điện thoại";
    } else if (!PHONE_REGEX.test(form.customerPhone.replace(/\s/g, ""))) {
      errs.customerPhone = "Số điện thoại không hợp lệ";
    }
    if (!form.shippingAddress.trim()) {
      errs.shippingAddress = "Vui lòng nhập địa chỉ giao hàng";
    }
    if (form.customerEmail && !/^\S+@\S+\.\S+$/.test(form.customerEmail)) {
      errs.customerEmail = "Email không hợp lệ";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Giỏ hàng đang trống");
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.replace(/\s/g, ""),
        customerEmail: form.customerEmail.trim() || null,
        shippingAddress: form.shippingAddress.trim(),
        note: form.note.trim() || null,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      };

      const result = await createOrder(payload);
      const order = result?.data ?? result;
      const orderId = order?.id;

      if (!orderId) {
        toast.error("Không nhận được mã đơn hàng từ máy chủ");
        return;
      }

      rememberOrderId(orderId);
      clearCart();
      toast.success("Đặt hàng thành công");
      router.push(`/orders/${orderId}`);
    } catch (error) {
      const msg =
        error?.response?.data?.messages?.[0] ||
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        "Đặt hàng thất bại, vui lòng thử lại";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText} min-h-screen`}>
      <Breadcrumb
        items={[
          { label: "Giỏ hàng", href: "/cart" },
          { label: "Thanh toán" },
        ]}
      />

      <section className={`py-12 ${theme.colors.bgPrimary}`}>
        <div className="max-w-6xl mx-auto px-4">
          <h1 className={`${theme.fonts.heading} text-4xl md:text-5xl text-white mb-8`}>
            Thông tin thanh toán
          </h1>

          {hydrated && items.length === 0 ? (
            <div className="bg-[#2B2B2B] p-12 text-center">
              <p className="text-white/70 text-lg mb-6">
                Giỏ hàng đang trống — không có gì để thanh toán.
              </p>
              <Link
                href="/san-pham"
                className="inline-block bg-[#D4A017] text-[#111111] px-8 py-3 font-semibold hover:bg-[#D4A017]/90 transition-colors"
              >
                Xem sản phẩm
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 bg-[#2B2B2B] p-6 space-y-4">
                <div>
                  <label className="block text-sm text-white/80 mb-2">
                    Họ tên <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={handleChange("customerName")}
                    className="w-full bg-[#111111] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4A017]"
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.customerName && (
                    <p className="text-red-400 text-xs mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/80 mb-2">
                      Số điện thoại <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={form.customerPhone}
                      onChange={handleChange("customerPhone")}
                      className="w-full bg-[#111111] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4A017]"
                      placeholder="0901234567"
                    />
                    {errors.customerPhone && (
                      <p className="text-red-400 text-xs mt-1">{errors.customerPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-white/80 mb-2">
                      Email (tuỳ chọn)
                    </label>
                    <input
                      type="email"
                      value={form.customerEmail}
                      onChange={handleChange("customerEmail")}
                      className="w-full bg-[#111111] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4A017]"
                      placeholder="email@example.com"
                    />
                    {errors.customerEmail && (
                      <p className="text-red-400 text-xs mt-1">{errors.customerEmail}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/80 mb-2">
                    Địa chỉ giao hàng <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={form.shippingAddress}
                    onChange={handleChange("shippingAddress")}
                    className="w-full bg-[#111111] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4A017]"
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                  />
                  {errors.shippingAddress && (
                    <p className="text-red-400 text-xs mt-1">{errors.shippingAddress}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-white/80 mb-2">
                    Ghi chú (tuỳ chọn)
                  </label>
                  <textarea
                    rows={2}
                    value={form.note}
                    onChange={handleChange("note")}
                    className="w-full bg-[#111111] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4A017]"
                    placeholder="Yêu cầu đặc biệt cho đơn hàng (nếu có)"
                  />
                </div>
              </div>

              <div className="bg-[#2B2B2B] p-6 h-fit sticky top-[160px]">
                <h2 className="text-xl text-white font-semibold mb-4">
                  Đơn hàng của bạn
                </h2>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between gap-2 text-sm"
                    >
                      <span className="text-white/80 flex-1">
                        {item.snapshot?.title}{" "}
                        <span className="text-white/40">× {item.quantity}</span>
                      </span>
                      <span className="text-white font-medium shrink-0">
                        {formatVND(
                          (Number(item.snapshot?.price) || 0) * item.quantity
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4 mb-6">
                  <div className="flex justify-between text-lg text-white font-bold">
                    <span>Tổng</span>
                    <span className="text-[#D4A017]">{formatVND(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !hydrated}
                  className="block w-full bg-[#D4A017] text-[#111111] py-3 text-center font-semibold hover:bg-[#D4A017]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Đang đặt hàng..." : "Đặt hàng"}
                </button>
                <p className="text-xs text-white/50 mt-3 text-center">
                  Đơn hàng sẽ được xác nhận qua điện thoại trước khi giao.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
