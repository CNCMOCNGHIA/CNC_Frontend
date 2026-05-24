"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";

import { getQuotas } from "@/services/quota";
import { formatDateVN } from "@/lib/format";

const PAGE_SIZE = 10;

export default function QuotasTable() {
  const [quotas, setQuotas] = useState([]);
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const result = await getQuotas({
        page: pageNumber,
        pageSize: PAGE_SIZE,
        search: search || undefined,
      });
      const items = result?.data?.items ?? result?.data ?? [];
      setQuotas(items);
      setPage({
        pageNumber:
          result?.data?.page ?? result?.data?.pageNumber ?? pageNumber,
        pageSize: result?.data?.pageSize ?? PAGE_SIZE,
        totalCount: result?.data?.totalCount ?? items.length,
        totalPages: result?.data?.totalPages ?? 1,
        hasNext: result?.data?.hasNext ?? false,
        hasPrevious: result?.data?.hasPrevious ?? false,
      });
    } catch (error) {
      console.error("Error fetching quotas:", error);
      toast.error("Không thể tải danh sách báo giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleClear = () => {
    setSearchInput("");
    setSearch("");
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-black">Yêu cầu báo giá</h2>

        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm theo tên/SĐT/email..."
              className="bg-black text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-white" size={18} />
          </form>

          {search && (
            <button
              onClick={handleClear}
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
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                SĐT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Vật liệu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                SL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                File
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Ngày gửi
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : quotas.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                  Chưa có yêu cầu báo giá nào.
                </td>
              </tr>
            ) : (
              quotas.map((quota) => (
                <motion.tr
                  key={quota.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {quota.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {quota.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {quota.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {quota.materialType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {quota.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {quota.files?.length ? (
                      <span className="inline-flex items-center gap-1 text-gray-700">
                        <Paperclip className="w-4 h-4" />
                        {quota.files.length}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDateVN(quota.createDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/management/quotas/${quota.id}`}
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

        {quotas.length > 0 && (
          <div className="flex justify-between items-center mt-4 px-2">
            <div className="text-sm text-gray-600">
              {(page.pageNumber - 1) * page.pageSize + 1}–
              {Math.min(page.pageNumber * page.pageSize, page.totalCount)} /{" "}
              {page.totalCount} yêu cầu
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
