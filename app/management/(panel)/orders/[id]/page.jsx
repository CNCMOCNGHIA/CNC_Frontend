"use client";

import { use } from "react";
import Header from "@/components/common/Header";
import OrderManageDetail from "@/components/admin/OrderManageDetail";

export default function OrderManagePage({ params }) {
  const { id } = use(params);
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Chi tiết đơn hàng" />
      <main className="max-w-5xl mx-auto py-6 px-4 lg:px-8">
        <OrderManageDetail orderId={id} />
      </main>
    </div>
  );
}
