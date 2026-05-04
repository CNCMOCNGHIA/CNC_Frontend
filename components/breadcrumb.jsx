"use client";

import Link from "next/link";
import { theme } from "@/constants/theme";

export function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className={`${theme.colors.bgSecondary} border-y border-white/10`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm md:text-base">
          <li>
            <Link
              href="/"
              className="text-white/70 hover:text-[#D4A017] transition-colors uppercase tracking-wider"
            >
              Trang chủ
            </Link>
          </li>
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={i} className="flex items-center gap-x-3">
                <span className="text-white/40">/</span>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-white/70 hover:text-[#D4A017] transition-colors uppercase tracking-wider"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="text-[#D4A017] uppercase tracking-wider"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
