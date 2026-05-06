"use client";

import Header from "@/components/common/Header";
import OrdersTable from "@/components/admin/OrdersTable";

export default function OrdersPage() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Quản lý đơn hàng" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <OrdersTable />
      </main>
    </div>
  );
}
