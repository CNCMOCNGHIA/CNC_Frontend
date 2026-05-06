"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { getOrders } from "@/services/order";
import { formatVND, formatDateVN } from "@/lib/format";
import {
  orderStatusLabel,
  orderStatusColor,
  orderStatusOptions,
} from "@/constants/orderStatus";

const PAGE_SIZE = 10;

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [statusFilter, setStatusFilter] = useState(""); // "" = all
  const [phoneFilter, setPhoneFilter] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const result = await getOrders({
        pageNumber,
        pageSize: PAGE_SIZE,
        status: statusFilter === "" ? undefined : Number(statusFilter),
        customerPhone: phoneFilter || undefined,
      });
      const items = result?.data?.items ?? result?.data ?? [];
      setOrders(items);
      setPage({
        pageNumber: result?.data?.pageNumber ?? pageNumber,
        pageSize: result?.data?.pageSize ?? PAGE_SIZE,
        totalCount: result?.data?.totalCount ?? items.length,
        totalPages: result?.data?.totalPages ?? 1,
        hasNext: result?.data?.hasNext ?? false,
        hasPrevious: result?.data?.hasPrevious ?? false,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, phoneFilter]);

  const handlePhoneSearch = (e) => {
    e.preventDefault();
    setPhoneFilter(phoneInput.trim());
  };

  const handleClearFilters = () => {
    setStatusFilter("");
    setPhoneInput("");
    setPhoneFilter("");
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-black">Quản lý đơn hàng</h2>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              {orderStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handlePhoneSearch} className="relative">
            <input
              type="text"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="Tìm theo SĐT..."
              className="bg-black text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-white" size={18} />
          </form>

          {(statusFilter !== "" || phoneFilter) && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Xoá lọc
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                SĐT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Tổng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  Chưa có đơn hàng nào.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-black">
                    {order.id?.slice?.(0, 8) ?? order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {order.customerPhone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-medium">
                    {formatVND(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <span
                      className={`inline-block px-2 py-1 border ${
                        orderStatusColor[order.status] ??
                        "bg-gray-100 text-gray-800 border-gray-300"
                      }`}
                    >
                      {orderStatusLabel[order.status] ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDateVN(order.createDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/management/orders/${order.id}`}
                      className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Xem
                    </Link>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>

        {orders.length > 0 && (
          <div className="flex justify-between items-center mt-4 px-2">
            <div className="text-sm text-gray-600">
              {(page.pageNumber - 1) * page.pageSize + 1}–
              {Math.min(page.pageNumber * page.pageSize, page.totalCount)} /{" "}
              {page.totalCount} đơn
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => load(page.pageNumber - 1)}
                disabled={!page.hasPrevious}
                className="p-2 rounded-lg bg-black text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-3 text-black">
                {page.pageNumber} / {page.totalPages}
              </span>
              <button
                onClick={() => load(page.pageNumber + 1)}
                disabled={!page.hasNext}
                className="p-2 rounded-lg bg-black text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
