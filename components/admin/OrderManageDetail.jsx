"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { getOrder, updateOrderStatus } from "@/services/order";
import { formatVND, formatDateVN } from "@/lib/format";
import {
  OrderStatus,
  orderStatusLabel,
  orderStatusColor,
} from "@/constants/orderStatus";

export default function OrderManageDetail({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      const result = await getOrder(orderId);
      const data = result?.data ?? result;
      setOrder(data);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError(
        err?.response?.status === 404
          ? "Không tìm thấy đơn hàng"
          : "Không thể tải đơn hàng"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleMarkPaid = async () => {
    if (!window.confirm("Xác nhận đơn hàng đã được thanh toán?")) return;
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, OrderStatus.Paid);
      toast.success("Đã đánh dấu đơn đã thanh toán");
      await fetchOrder();
    } catch (err) {
      toast.error(
        err?.response?.data?.messages?.[0] ||
          err?.response?.data?.message ||
          "Cập nhật thất bại"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    const isPaid = order?.status === OrderStatus.Paid;
    const message = isPaid
      ? "Đơn này đã thanh toán. Huỷ đơn sẽ KHÔNG tự động hoàn tiền hay khôi phục tồn kho — bạn cần xử lý refund thủ công. Tiếp tục huỷ?"
      : "Huỷ đơn này? Tồn kho sẽ được tự động khôi phục.";
    if (!window.confirm(message)) return;

    setUpdating(true);
    try {
      await updateOrderStatus(orderId, OrderStatus.Cancelled);
      toast.success("Đã huỷ đơn hàng");
      await fetchOrder();
    } catch (err) {
      toast.error(
        err?.response?.data?.messages?.[0] ||
          err?.response?.data?.message ||
          "Huỷ đơn thất bại"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-12 text-center text-gray-500">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-12 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link
          href="/management/orders"
          className="text-indigo-600 hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  if (!order) return null;

  const isUnpaid = order.status === OrderStatus.Unpaid;
  const isPaid = order.status === OrderStatus.Paid;
  const isCancelled = order.status === OrderStatus.Cancelled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <Link
          href="/management/orders"
          className="text-sm text-gray-700 hover:text-black inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Link>
        <span
          className={`inline-block px-3 py-1 text-sm font-semibold border ${
            orderStatusColor[order.status] ??
            "bg-gray-100 text-gray-800 border-gray-300"
          }`}
        >
          {orderStatusLabel[order.status] ?? "—"}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-black">
              Đơn hàng #{order.id}
            </h2>
            {order.createDate && (
              <p className="text-sm text-gray-600 mt-1">
                Đặt lúc {formatDateVN(order.createDate)}
              </p>
            )}
          </div>

          {!isCancelled && (
            <div className="flex gap-2 flex-wrap">
              {isUnpaid && (
                <button
                  onClick={handleMarkPaid}
                  disabled={updating}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Đánh dấu đã thanh toán
                </button>
              )}
              {(isUnpaid || isPaid) && (
                <button
                  onClick={handleCancel}
                  disabled={updating}
                  className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Huỷ đơn
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
              Khách hàng
            </h3>
            <div className="space-y-1 text-black">
              <p className="font-medium">{order.customerName}</p>
              <p>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="text-indigo-600 hover:underline"
                >
                  {order.customerPhone}
                </a>
              </p>
              {order.customerEmail && (
                <p className="text-gray-600">{order.customerEmail}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
              Địa chỉ giao hàng
            </h3>
            <p className="text-black">{order.shippingAddress}</p>
          </div>
        </div>

        {order.note && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
              Ghi chú
            </h3>
            <p className="text-black bg-gray-50 p-3 rounded">{order.note}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-black mb-4">Sản phẩm</h3>
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                Sản phẩm
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 uppercase">
                Đơn giá
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 uppercase">
                SL
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 uppercase">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(order.items ?? []).map((item, idx) => {
              const unitPrice = Number(item.unitPrice ?? item.price) || 0;
              const qty = Number(item.quantity) || 0;
              return (
                <tr key={item.productId ?? idx}>
                  <td className="px-3 py-3 text-black">
                    {item.productTitle ?? item.title ?? "Sản phẩm"}
                  </td>
                  <td className="px-3 py-3 text-right text-black">
                    {formatVND(unitPrice)}
                  </td>
                  <td className="px-3 py-3 text-right text-black">{qty}</td>
                  <td className="px-3 py-3 text-right text-black font-medium">
                    {formatVND(unitPrice * qty)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300">
              <td colSpan="3" className="px-3 py-3 text-right font-semibold text-black">
                Tổng cộng
              </td>
              <td className="px-3 py-3 text-right font-bold text-lg text-black">
                {formatVND(order.totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </motion.div>
  );
}
