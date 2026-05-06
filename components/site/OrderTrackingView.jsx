"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, MapPin, FileText, Info } from "lucide-react";

import { theme } from "@/constants/theme";
import { Breadcrumb } from "@/components/breadcrumb";
import { formatVND, formatDateVN } from "@/lib/format";
import {
  OrderStatus,
  orderStatusLabel,
  orderStatusColor,
} from "@/constants/orderStatus";
import { getOrder } from "@/services/order";

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

export default function OrderTrackingView({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await getOrder(orderId);
        const data = result?.data ?? result;
        if (!cancelled) {
          setOrder(data);
          rememberOrderId(orderId);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        if (!cancelled) {
          setError(
            err?.response?.status === 404
              ? "Không tìm thấy đơn hàng"
              : "Không thể tải đơn hàng, vui lòng thử lại"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const status = order?.status;

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText} min-h-screen`}>
      <Breadcrumb
        items={[
          { label: "Đơn hàng" },
          { label: orderId },
        ]}
      />

      <section className={`py-12 ${theme.colors.bgPrimary}`}>
        <div className="max-w-4xl mx-auto px-4">
          {loading ? (
            <p className="text-white/60 py-12 text-center">Đang tải đơn hàng...</p>
          ) : error ? (
            <div className="bg-[#2B2B2B] p-12 text-center">
              <p className="text-red-400 text-lg mb-2">{error}</p>
              <p className="text-white/60 text-sm mb-6">Mã đơn: {orderId}</p>
              <Link
                href="/san-pham"
                className="inline-block bg-[#D4A017] text-[#111111] px-8 py-3 font-semibold hover:bg-[#D4A017]/90 transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : order ? (
            <>
              <div className="bg-[#2B2B2B] p-6 md:p-8 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h1 className={`${theme.fonts.heading} text-3xl md:text-4xl text-white`}>
                      Đơn hàng #{order.id}
                    </h1>
                    {order.createDate && (
                      <p className="text-white/60 text-sm mt-1">
                        Đặt lúc {formatDateVN(order.createDate)}
                      </p>
                    )}
                  </div>
                  <span
                    className={`inline-block px-4 py-2 text-sm font-semibold border ${
                      orderStatusColor[status] ??
                      "bg-gray-100 text-gray-800 border-gray-300"
                    }`}
                  >
                    {orderStatusLabel[status] ?? "Không xác định"}
                  </span>
                </div>

                {status === OrderStatus.Unpaid && (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-4 flex gap-3 mb-6">
                    <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-200 font-medium">
                        Đơn đã ghi nhận
                      </p>
                      <p className="text-amber-100/80 text-sm mt-1">
                        Vui lòng liên hệ shop để hoàn tất thanh toán. Chúng tôi
                        sẽ chủ động gọi xác nhận đơn hàng trong thời gian sớm
                        nhất.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-white font-semibold mb-3">
                      Thông tin khách hàng
                    </h2>
                    <div className="space-y-2 text-white/80 text-sm">
                      <p className="font-medium text-white">
                        {order.customerName}
                      </p>
                      <p className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="hover:text-[#D4A017] transition-colors"
                        >
                          {order.customerPhone}
                        </a>
                      </p>
                      {order.customerEmail && (
                        <p className="text-white/70">{order.customerEmail}</p>
                      )}
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                        <span>{order.shippingAddress}</span>
                      </p>
                    </div>
                  </div>

                  {order.note && (
                    <div>
                      <h2 className="text-white font-semibold mb-3">Ghi chú</h2>
                      <p className="text-white/70 text-sm flex items-start gap-2">
                        <FileText className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                        <span>{order.note}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#2B2B2B] p-6 md:p-8">
                <h2 className="text-xl text-white font-semibold mb-4">
                  Sản phẩm
                </h2>
                <div className="divide-y divide-white/10">
                  {(order.items ?? []).map((item, idx) => {
                    const lineTotal =
                      (Number(item.unitPrice ?? item.price) || 0) *
                      (Number(item.quantity) || 0);
                    return (
                      <div
                        key={item.productId ?? idx}
                        className="py-4 flex justify-between gap-4"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {item.productTitle ?? item.title ?? "Sản phẩm"}
                          </p>
                          <p className="text-white/50 text-sm mt-1">
                            {formatVND(item.unitPrice ?? item.price)} ×{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <p className="text-white font-semibold whitespace-nowrap">
                          {formatVND(lineTotal)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-white/10 mt-4 pt-4 flex justify-between text-lg font-bold">
                  <span className="text-white">Tổng cộng</span>
                  <span className="text-[#D4A017]">
                    {formatVND(order.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/san-pham"
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
