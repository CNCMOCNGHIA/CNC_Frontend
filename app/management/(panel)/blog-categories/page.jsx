"use client";

import Header from "@/components/common/Header";
import CategoryManager from "@/components/admin/CategoryManager";

export default function BlogCategoriesPage() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Danh mục bài đăng" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <CategoryManager
          type="Blog"
          title="Danh mục bài đăng"
          description="Quản lý cây danh mục dùng cho bài đăng. Có thể tạo nhiều cấp."
        />
      </main>
    </div>
  );
}
