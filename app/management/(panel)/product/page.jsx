"use client";

import Header from "@/components/common/Header";
import ProductTable from "@/components/project/ProductTable";

export default function ProductPage() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Quản lý sản phẩm" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <ProductTable />
      </main>
    </div>
  );
}
