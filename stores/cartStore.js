"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Cart item shape:
//   { productId, quantity, snapshot: { title, price, thumbnail, stock } }
// `snapshot` is a copy taken at add-time so the cart still renders if the product
// later changes or is removed BE-side. `stock` lets us clamp quantity in the cart UI.

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        const { productId, snapshot } = item;
        if (!productId) return;
        const stock = Number(snapshot?.stock ?? 0);
        const inc = Math.max(1, Math.floor(quantity));
        set((state) => {
          const existing = state.items.find((i) => i.productId === productId);
          if (existing) {
            const next = stock > 0
              ? clamp(existing.quantity + inc, 1, stock)
              : existing.quantity + inc;
            return {
              items: state.items.map((i) =>
                i.productId === productId
                  ? { ...i, quantity: next, snapshot: { ...i.snapshot, ...snapshot } }
                  : i
              ),
            };
          }
          const initial = stock > 0 ? clamp(inc, 1, stock) : inc;
          return {
            items: [...state.items, { productId, quantity: initial, snapshot }],
          };
        });
      },

      setQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items
            .map((i) => {
              if (i.productId !== productId) return i;
              const stock = Number(i.snapshot?.stock ?? 0);
              const q = Math.floor(quantity);
              if (q <= 0) return null;
              return { ...i, quantity: stock > 0 ? clamp(q, 1, stock) : q };
            })
            .filter(Boolean),
        }));
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      clear: () => set({ items: [] }),

      getCount: () =>
        get().items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0),

      getTotal: () =>
        get().items.reduce(
          (sum, i) =>
            sum + (Number(i.snapshot?.price) || 0) * (Number(i.quantity) || 0),
          0
        ),
    }),
    {
      name: "cnc-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
