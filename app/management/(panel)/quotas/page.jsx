"use client";

import Header from "@/components/common/Header";
import QuotasTable from "@/components/admin/QuotasTable";

export default function QuotasPage() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Yêu cầu báo giá" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <QuotasTable />
      </main>
    </div>
  );
}
