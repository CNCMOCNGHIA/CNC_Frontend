"use client";

import Header from "@/components/common/Header";
import CategoryManager from "@/components/admin/CategoryManager";

export default function ProductCategoriesPage() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Danh mục sản phẩm" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <CategoryManager type="Product" title="Danh mục sản phẩm" />
      </main>
    </div>
  );
}
