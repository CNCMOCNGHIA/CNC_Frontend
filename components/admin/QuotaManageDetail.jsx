"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Trash2, Download, FileText } from "lucide-react";
import { toast } from "sonner";

import {
  getQuota,
  deleteQuota,
  resolveQuotaFileUrl,
} from "@/services/quota";
import { formatDateVN } from "@/lib/format";

export default function QuotaManageDetail({ quotaId }) {
  const router = useRouter();
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!quotaId) return;
    (async () => {
      try {
        const result = await getQuota(quotaId);
        setQuota(result?.data ?? result);
      } catch (err) {
        console.error("Error fetching quota:", err);
        setError(
          err?.response?.status === 404
            ? "Không tìm thấy yêu cầu báo giá"
            : "Không thể tải yêu cầu báo giá"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [quotaId]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Xoá yêu cầu báo giá này? Các file CAD đính kèm cũng sẽ bị xoá."
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      const result = await deleteQuota(quotaId);
      // BE: { data: string[] (URL file đã xoá), messages: ["Quota deleted successfully"] }
      toast.success(result?.messages?.[0] ?? "Đã xoá yêu cầu báo giá");
      router.push("/management/quotas");
    } catch (err) {
      toast.error(
        err?.messages?.[0] ??
          err?.response?.data?.messages?.[0] ??
          "Xoá thất bại"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Đang tải...</div>;
  }

  if (error || !quota) {
    return (
      <div className="bg-white shadow rounded-xl p-6">
        <p className="text-red-500 mb-4">{error ?? "Không có dữ liệu"}</p>
        <Link
          href="/management/quotas"
          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <Link
          href="/management/quotas"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" />
          Danh sách
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          {deleting ? "Đang xoá..." : "Xoá"}
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Info label="Họ tên" value={quota.fullName} />
          <Info label="Số điện thoại" value={quota.phoneNumber} />
          <Info label="Email" value={quota.email} />
          <Info label="Ngày gửi" value={formatDateVN(quota.createDate)} />
          <Info label="Vật liệu" value={quota.materialType} />
          <Info label="Số lượng" value={quota.quantity} />
          <Info
            label="Thời gian giao"
            value={quota.deliveryTime || "—"}
          />
        </div>

        {quota.note && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Ghi chú</p>
            <p className="text-sm text-black whitespace-pre-wrap">
              {quota.note}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold text-black mb-4">
          File đính kèm ({quota.files?.length ?? 0})
        </h3>
        {quota.files?.length ? (
          <ul className="divide-y divide-gray-200">
            {quota.files.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-gray-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-black truncate">
                      {file.fileName}
                    </p>
                    <p className="text-xs text-gray-500">{file.extension}</p>
                  </div>
                </div>
                <a
                  href={resolveQuotaFileUrl(file)}
                  download={file.fileName}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 shrink-0 ml-4"
                >
                  <Download className="w-4 h-4" />
                  Tải
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Không có file đính kèm.</p>
        )}
      </div>
    </motion.div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-black">{value ?? "—"}</p>
    </div>
  );
}
