"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

import { theme } from "@/constants/theme";
import { Breadcrumb } from "@/components/breadcrumb";
import { formatVND } from "@/lib/format";
import { useCartStore } from "@/stores/cartStore";

export default function CartView() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  // Hydration guard for persisted store.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const total = items.reduce(
    (sum, i) =>
      sum + (Number(i.snapshot?.price) || 0) * (Number(i.quantity) || 0),
    0
  );

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText} min-h-screen`}>
      <Breadcrumb items={[{ label: "Giỏ hàng" }]} />

      <section className={`py-12 ${theme.colors.bgPrimary}`}>
        <div className="max-w-6xl mx-auto px-4">
          <h1 className={`${theme.fonts.heading} text-4xl md:text-5xl text-white mb-8`}>
            Giỏ hàng của bạn
          </h1>

          {!hydrated ? (
            <p className="text-white/60 py-12">Đang tải...</p>
          ) : items.length === 0 ? (
            <div className="bg-[#2B2B2B] p-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-white/40 mb-4" />
              <p className="text-white/70 text-lg mb-6">Giỏ hàng đang trống</p>
              <Link
                href="/san-pham"
                className="inline-block bg-[#D4A017] text-[#111111] px-8 py-3 font-semibold hover:bg-[#D4A017]/90 transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => {
                  const stock = Number(item.snapshot?.stock ?? 0);
                  const price = Number(item.snapshot?.price ?? 0);
                  const lineTotal = price * item.quantity;
                  const overStock = stock > 0 && item.quantity > stock;

                  return (
                    <div
                      key={item.productId}
                      className="bg-[#2B2B2B] p-4 flex gap-4"
                    >
                      {item.snapshot?.thumbnail ? (
                        <img
                          src={item.snapshot.thumbnail}
                          alt={item.snapshot?.title ?? "Sản phẩm"}
                          className="w-24 h-24 object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-[#111111] shrink-0" />
                      )}

                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between gap-4">
                          <h3 className="text-lg text-white font-semibold">
                            {item.snapshot?.title ?? "Sản phẩm"}
                          </h3>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-white/60 hover:text-red-400 transition-colors shrink-0"
                            aria-label="Xoá"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <p className="text-[#D4A017] font-semibold mt-1">
                          {formatVND(price)}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-3">
                          <div className="flex items-center border border-white/20">
                            <button
                              onClick={() =>
                                setQuantity(item.productId, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                              aria-label="Giảm"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={stock || undefined}
                              value={item.quantity}
                              onChange={(e) => {
                                const v = parseInt(e.target.value, 10);
                                if (Number.isFinite(v) && v > 0) {
                                  setQuantity(item.productId, v);
                                }
                              }}
                              className="w-12 h-8 bg-transparent text-white text-center text-sm focus:outline-none"
                            />
                            <button
                              onClick={() =>
                                setQuantity(item.productId, item.quantity + 1)
                              }
                              disabled={stock > 0 && item.quantity >= stock}
                              className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              aria-label="Tăng"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-white font-semibold">
                            {formatVND(lineTotal)}
                          </p>
                        </div>

                        {stock > 0 && (
                          <p
                            className={`text-xs mt-2 ${
                              overStock ? "text-red-400" : "text-white/40"
                            }`}
                          >
                            {overStock
                              ? `Chỉ còn ${stock} sản phẩm trong kho`
                              : `Còn ${stock} sản phẩm`}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => {
                    if (window.confirm("Xoá toàn bộ giỏ hàng?")) clear();
                  }}
                  className="text-sm text-white/50 hover:text-red-400 transition-colors mt-2"
                >
                  Xoá toàn bộ
                </button>
              </div>

              <div className="bg-[#2B2B2B] p-6 h-fit sticky top-[160px]">
                <h2 className="text-xl text-white font-semibold mb-4">
                  Tóm tắt đơn hàng
                </h2>
                <div className="space-y-2 text-white/80 mb-4">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>{formatVND(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/50">
                    <span>Phí vận chuyển</span>
                    <span>Liên hệ</span>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 mb-6">
                  <div className="flex justify-between text-lg text-white font-bold">
                    <span>Tổng</span>
                    <span className="text-[#D4A017]">{formatVND(total)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full bg-[#D4A017] text-[#111111] py-3 text-center font-semibold hover:bg-[#D4A017]/90 transition-colors"
                >
                  Tiến hành thanh toán
                </Link>
                <Link
                  href="/san-pham"
                  className="block w-full mt-3 text-center text-white/70 hover:text-white text-sm transition-colors"
                >
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
