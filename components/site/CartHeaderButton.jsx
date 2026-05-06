"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export default function CartHeaderButton() {
  const items = useCartStore((s) => s.items);
  // Avoid SSR/CSR hydration mismatch from persisted localStorage state.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const count = hydrated
    ? items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0)
    : 0;

  return (
    <Link
      href="/cart"
      aria-label="Giỏ hàng"
      className="relative inline-flex items-center justify-center w-10 h-10 text-[#111111] hover:text-[#D4A017] transition-colors shrink-0"
    >
      <ShoppingCart className="w-6 h-6" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#D4A017] text-[#111111] text-xs font-bold flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
