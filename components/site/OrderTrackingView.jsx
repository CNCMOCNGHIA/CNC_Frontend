"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  Clock,
  Copy,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { theme } from "@/constants/theme";
import { Breadcrumb } from "@/components/breadcrumb";
import { formatVND, formatDateVN } from "@/lib/format";
import {
  OrderStatus,
  orderStatusLabel,
  orderStatusColor,
} from "@/constants/orderStatus";
import { getOrder } from "@/services/order";
import { useOrderStatus } from "@/hooks/useOrderStatus";

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

const formatCountdown = (ms) => {
  if (!Number.isFinite(ms) || ms <= 0) return "00:00";
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const copyToClipboard = async (value, label) => {
  if (!value) return;
  try {
    await navigator.clipboard.writeText(String(value));
    toast.success(`Đã sao chép ${label}`);
  } catch {
    toast.error("Trình duyệt không hỗ trợ sao chép tự động");
  }
};

export default function OrderTrackingView({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      const result = await getOrder(orderId);
      const data = result?.data ?? result;
      setOrder(data);
      rememberOrderId(orderId);
      return data;
    } catch (err) {
      console.error("Error fetching order:", err);
      setError(
        err?.status === 404 || err?.resultStatus === "NotFound"
          ? "Không tìm thấy đơn hàng"
          : "Không thể tải đơn hàng, vui lòng thử lại"
      );
      return null;
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    (async () => {
      const data = await fetchOrder();
      if (!cancelled && data) setLoading(false);
      else if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId, fetchOrder]);

  // Only poll while the order is in a state that can still change.
  const shouldPoll =
    !!order &&
    order.status === OrderStatus.Unpaid &&
    !!order.expiresAt;

  const { status: liveStatus, isPolling, error: pollError } = useOrderStatus(
    shouldPoll ? orderId : null
  );

  // When the live status transitions away from Unpaid, refetch the full order
  // so the UI shows paidAt / fresh totals — the status endpoint payload is
  // intentionally lightweight.
  useEffect(() => {
    if (!liveStatus) return;
    if (
      liveStatus.status &&
      liveStatus.status !== OrderStatus.Unpaid &&
      order?.status === OrderStatus.Unpaid
    ) {
      fetchOrder();
    }
  }, [liveStatus, order?.status, fetchOrder]);

  // The effective status: prefer the live status (which can flip to Expired
  // even before the full order is refetched), fall back to the persisted order.
  const effectiveStatus = liveStatus?.status ?? order?.status;
  const expiresAt = order?.expiresAt
    ? new Date(order.expiresAt).getTime()
    : null;

  // Countdown is only meaningful while we're still waiting on payment.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!expiresAt || effectiveStatus !== OrderStatus.Unpaid) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt, effectiveStatus]);

  const msLeft = expiresAt ? expiresAt - now : null;
  const showQrSection =
    effectiveStatus === OrderStatus.Unpaid &&
    order?.qrUrl &&
    msLeft !== null &&
    msLeft > 0 &&
    !liveStatus?.isExpired;

  const showExpired =
    effectiveStatus === OrderStatus.Expired ||
    effectiveStatus === OrderStatus.Cancelled ||
    (effectiveStatus === OrderStatus.Unpaid && msLeft !== null && msLeft <= 0);

  const showPaid = effectiveStatus === OrderStatus.Paid;

  const headerStatusKey = showExpired
    ? effectiveStatus === OrderStatus.Cancelled
      ? OrderStatus.Cancelled
      : OrderStatus.Expired
    : effectiveStatus;

  const totalAmount = useMemo(
    () => Number(order?.totalAmount) || 0,
    [order?.totalAmount]
  );

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
                      Đơn hàng {order.code ?? `#${order.id}`}
                    </h1>
                    {(order.createdAt ?? order.createDate) && (
                      <p className="text-white/60 text-sm mt-1">
                        Đặt lúc {formatDateVN(order.createdAt ?? order.createDate)}
                      </p>
                    )}
                  </div>
                  <span
                    className={`inline-block px-4 py-2 text-sm font-semibold border ${
                      orderStatusColor[headerStatusKey] ??
                      "bg-gray-100 text-gray-800 border-gray-300"
                    }`}
                  >
                    {orderStatusLabel[headerStatusKey] ?? "Không xác định"}
                  </span>
                </div>

                {showPaid && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 flex gap-3 mb-6">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-emerald-200 font-medium">
                        Thanh toán thành công
                      </p>
                      <p className="text-emerald-100/80 text-sm mt-1">
                        Chúng tôi đã nhận được khoản chuyển khoản của bạn
                        {order.paidAt ? ` lúc ${formatDateVN(order.paidAt)}` : ""}.
                        Đơn hàng sẽ được xử lý và giao trong thời gian sớm nhất.
                      </p>
                    </div>
                  </div>
                )}

                {showExpired && (
                  <div className="bg-rose-500/10 border border-rose-500/30 p-4 mb-6">
                    <div className="flex gap-3 mb-3">
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-rose-200 font-medium">
                          {effectiveStatus === OrderStatus.Cancelled
                            ? "Đơn đã bị huỷ"
                            : "Mã QR đã hết hạn"}
                        </p>
                        <p className="text-rose-100/80 text-sm mt-1">
                          {effectiveStatus === OrderStatus.Cancelled
                            ? "Đơn hàng này đã được huỷ. Vui lòng đặt lại nếu bạn vẫn muốn mua các sản phẩm này."
                            : "Quá thời gian thanh toán, hệ thống đã tự động huỷ và hoàn lại tồn kho. Vui lòng đặt lại đơn mới."}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/cart"
                      className="inline-block bg-[#D4A017] text-[#111111] px-6 py-2.5 font-semibold hover:bg-[#D4A017]/90 transition-colors"
                    >
                      Quay lại giỏ hàng để đặt lại
                    </Link>
                  </div>
                )}

                {showQrSection && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 md:p-6 bg-[#111111] border border-white/10">
                    <div className="flex flex-col items-center">
                      <p className="text-white/80 text-sm mb-3 text-center">
                        Mở app ngân hàng và quét mã VietQR bên dưới
                      </p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={order.qrUrl}
                        alt="Mã QR thanh toán"
                        className="w-full max-w-[260px] bg-white p-2"
                      />
                      <div className="mt-4 flex items-center gap-2 text-amber-300">
                        <Clock className="w-4 h-4" />
                        <span className="font-mono text-lg">
                          {formatCountdown(msLeft)}
                        </span>
                      </div>
                      <p className="text-white/40 text-xs mt-1">
                        Mã hết hạn sau thời gian trên
                      </p>
                    </div>

                    <div>
                      <h3 className="text-white font-semibold mb-3">
                        Hoặc chuyển khoản thủ công
                      </h3>
                      <div className="space-y-3 text-sm">
                        <PaymentRow
                          label="Ngân hàng"
                          value={order.bankCode}
                        />
                        <PaymentRow
                          label="Số tài khoản"
                          value={order.bankAccount}
                          copy
                          copyLabel="số tài khoản"
                        />
                        <PaymentRow
                          label="Chủ tài khoản"
                          value={order.accountHolder}
                        />
                        <PaymentRow
                          label="Số tiền"
                          value={formatVND(totalAmount)}
                          highlight
                          copyValue={String(totalAmount)}
                          copy
                          copyLabel="số tiền"
                        />
                        <PaymentRow
                          label="Nội dung CK"
                          value={order.code}
                          highlight
                          copy
                          copyLabel="nội dung chuyển khoản"
                        />
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-xs">
                        {pollError ? (
                          <>
                            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                            <span className="text-amber-300">
                              Mất kết nối tạm thời, đang thử lại...
                            </span>
                          </>
                        ) : isPolling ? (
                          <>
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-white/60">
                              Đang chờ xác nhận thanh toán...
                            </span>
                          </>
                        ) : null}
                      </div>

                      <p className="text-white/40 text-xs mt-3 leading-relaxed">
                        Lưu ý: ghi đúng nội dung chuyển khoản{" "}
                        <span className="font-mono text-white/70">
                          {order.code}
                        </span>{" "}
                        để hệ thống tự động xác nhận. Sai nội dung có thể khiến đơn không được ghi nhận tự động.
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

function PaymentRow({ label, value, highlight, copy, copyValue, copyLabel }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-white/50 shrink-0">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`truncate font-semibold ${
            highlight ? "text-[#D4A017]" : "text-white"
          }`}
        >
          {value}
        </span>
        {copy && (
          <button
            type="button"
            onClick={() => copyToClipboard(copyValue ?? value, copyLabel ?? label.toLowerCase())}
            className="p-1 text-white/50 hover:text-white transition-colors shrink-0"
            aria-label={`Sao chép ${label}`}
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
