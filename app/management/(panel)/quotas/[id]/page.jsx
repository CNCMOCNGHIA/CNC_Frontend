"use client";

import { use } from "react";
import Header from "@/components/common/Header";
import QuotaManageDetail from "@/components/admin/QuotaManageDetail";

export default function QuotaManagePage({ params }) {
  const { id } = use(params);
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Chi tiết báo giá" />
      <main className="max-w-5xl mx-auto py-6 px-4 lg:px-8">
        <QuotaManageDetail quotaId={id} />
      </main>
    </div>
  );
}
