"use client";

import Sidebar from "@/components/common/Sidebar";

export default function PanelLayout({ children }) {
  return (
    <div className="flex h-screen bg-zinc-200 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
