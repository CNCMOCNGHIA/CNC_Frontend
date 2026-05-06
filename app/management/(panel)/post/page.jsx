"use client";

import Header from "@/components/common/Header";
import PostTable from "@/components/post/PostTable";

export default function PostPage() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Quản lý bài viết" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <PostTable />
      </main>
    </div>
  );
}
