"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { theme } from "@/constants/theme";
import { Breadcrumb } from "@/components/breadcrumb";
import { toSlug } from "@/lib/slug";
import { formatVND, resolveImageUrl } from "@/lib/format";
import { getProducts } from "@/services/product";
import { getCategories } from "@/services/category";
import { buildCategoryTree } from "@/lib/categoryTree";
import { useCartStore } from "@/stores/cartStore";

const FALLBACK_PRODUCTS = [
  {
    id: "fallback-1",
    name: "Kitchen Cabinet Components",
    description:
      "Precision-cut cabinet sides, shelves, and backs with edge banding",
    image:
      "https://images.unsplash.com/photo-1551907234-fb773fb08a2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    category: "Cabinets",
  },
  {
    id: "fallback-2",
    name: "Office Desk Components",
    description:
      "Modern desk tops and side panels with cable management routing",
    image:
      "https://images.unsplash.com/photo-1615990860014-99e51245218c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    category: "Furniture",
  },
];

const normalizeApiProduct = (p) => {
  const stock = Number(p.stock ?? 0);
  const price = Number(p.price ?? 0);
  const rawThumb = p.thumbnail ?? p.images?.[0] ?? null;
  const thumbnail = rawThumb ? resolveImageUrl(rawThumb) : null;
  return {
    id: p.id,
    isApi: true,
    title: p.title,
    name: p.title,
    subtitle: p.subtitle,
    description: p.subtitle ?? p.description ?? "",
    thumbnail,
    image: thumbnail,
    price,
    stock,
    categoryId: p.category?.id ?? null,
    categoryName: p.category?.name ?? "Khác",
  };
};

export default function ProductsView({ content }) {
  const { hero, capabilities, customQuoteCta } = content ?? {};
  const searchParams = useSearchParams();
  const urlCategoryId = searchParams.get("categoryId");

  const [apiProducts, setApiProducts] = useState(null); // null = chưa load, [] = đã load nhưng rỗng
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(urlCategoryId); // null = Tất cả
  const [categoryTree, setCategoryTree] = useState([]);
  const [hoveredRootId, setHoveredRootId] = useState(null);

  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    setSelectedCategoryId(urlCategoryId);
  }, [urlCategoryId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const envelope = await getCategories("Product");
        const flat = envelope?.data ?? [];
        if (!cancelled) setCategoryTree(buildCategoryTree(flat));
      } catch (error) {
        console.error("Error fetching categories:", error);
        if (!cancelled) setCategoryTree([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchProducts = useCallback(async (categoryId) => {
    setLoading(true);
    try {
      const page = await getProducts({
        pageNumber: 1,
        pageSize: 50,
        ...(categoryId ? { categoryId } : {}),
      });
      const items = page?.items ?? [];
      return items.map(normalizeApiProduct);
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const items = await fetchProducts(selectedCategoryId);
      if (!cancelled) setApiProducts(items);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedCategoryId, fetchProducts]);

  const usingFallback =
    !loading && !selectedCategoryId && (!apiProducts || apiProducts.length === 0);
  const products = usingFallback ? FALLBACK_PRODUCTS : apiProducts ?? [];
  const filteredProducts = products;

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.isApi) return;
    if (product.stock <= 0) {
      toast.error("Sản phẩm hiện đang hết hàng");
      return;
    }
    addItem(
      {
        productId: product.id,
        snapshot: {
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          stock: product.stock,
        },
      },
      1
    );
    toast.success("Đã thêm vào giỏ hàng");
  };

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>
      {hero && (
        <section className="relative h-[60vh] min-h-[500px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${hero.backgroundImage}')` }}
          >
            <div className="absolute inset-0 bg-[#111111]/70" />
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1
                className={`${theme.fonts.heading} ${theme.text.heroTitle} text-white mb-4`}
              >
                {hero.title}
              </h1>
              <p className="text-xl text-white/80 max-w-2xl">{hero.description}</p>
            </motion.div>
          </div>
        </section>
      )}

      <Breadcrumb items={[{ label: "Sản phẩm" }]} />

      {categoryTree.length > 0 && (
        <section className="py-12 bg-[#2B2B2B] top-[120px] z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div
              className="flex flex-wrap gap-4 justify-center"
              onMouseLeave={() => setHoveredRootId(null)}
            >
              <button
                onClick={() => setSelectedCategoryId(null)}
                onMouseEnter={() => setHoveredRootId(null)}
                className={`px-8 py-3 transition-colors ${
                  selectedCategoryId === null
                    ? "bg-[#D4A017] text-[#111111]"
                    : "bg-[#111111] text-white hover:bg-[#D4A017] hover:text-[#111111]"
                }`}
              >
                Tất cả
              </button>

              {categoryTree.map((root) => (
                <div
                  key={root.id}
                  className="relative"
                  onMouseEnter={() => setHoveredRootId(root.id)}
                >
                  <button
                    onClick={() => setSelectedCategoryId(root.id)}
                    className={`flex items-center gap-2 px-8 py-3 transition-colors ${
                      selectedCategoryId === root.id ||
                      root.children.some((c) => c.id === selectedCategoryId)
                        ? "bg-[#D4A017] text-[#111111]"
                        : "bg-[#111111] text-white hover:bg-[#D4A017] hover:text-[#111111]"
                    }`}
                  >
                    {root.name}
                    {root.children.length > 0 && <ChevronDown className="w-4 h-4" />}
                  </button>

                  {root.children.length > 0 && hoveredRootId === root.id && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50">
                      <div className="bg-[#111111] border border-[#D4A017]/30 shadow-lg min-w-[220px] py-2">
                        {root.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => {
                              setSelectedCategoryId(child.id);
                              setHoveredRootId(null);
                            }}
                            className={`w-full text-left px-5 py-2 transition-colors ${
                              selectedCategoryId === child.id
                                ? "bg-[#D4A017] text-[#111111]"
                                : "text-white hover:bg-[#D4A017] hover:text-[#111111]"
                            }`}
                          >
                            {child.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`py-12 ${theme.colors.bgPrimary}`}>
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <p className="text-center text-white/60 py-20">
              Đang tải sản phẩm...
            </p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-white/60 py-20">
              Chưa có sản phẩm nào.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => {
                const slug = toSlug(product.name ?? product.title ?? "");
                const href = product.isApi
                  ? `/san-pham/${slug}?id=${product.id}`
                  : `/san-pham/${slug}`;
                const outOfStock = product.isApi && product.stock <= 0;

                return (
                  <Link key={product.id} href={href}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-[#2B2B2B] overflow-hidden group flex flex-col h-full"
                    >
                      <div className="relative h-64 overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#111111]" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-60" />
                        {product.isApi && (
                          <span
                            className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold ${outOfStock
                                ? "bg-red-600 text-white"
                                : "bg-[#D4A017] text-[#111111]"
                              }`}
                          >
                            {outOfStock
                              ? "Hết hàng"
                              : `Còn ${product.stock} sản phẩm`}
                          </span>
                        )}
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-2xl text-white mb-2">
                          {product.name ?? product.title}
                        </h3>
                        {product.description && (
                          <p className="text-white/70 mb-4 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        {product.isApi ? (
                          <div className="mt-auto">
                            <p className="text-2xl text-[#D4A017] font-semibold mb-4">
                              {formatVND(product.price)}
                            </p>
                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              disabled={outOfStock}
                              className="w-full flex items-center justify-center gap-2 bg-[#D4A017] text-[#111111] py-3 font-semibold hover:bg-[#D4A017]/90 transition-colors disabled:bg-gray-600 disabled:text-white/60 disabled:cursor-not-allowed"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              {outOfStock ? "Hết hàng" : "Thêm vào giỏ"}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2 mt-auto">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-[#D4A017]" />
                              <span className="text-sm text-white/60">
                                Liên hệ để báo giá
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {capabilities && (
        <section className="py-20 bg-[#2B2B2B]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl text-white mb-4">
                {capabilities.title}
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                {capabilities.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(capabilities.items ?? []).map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[#111111] p-8"
                >
                  <h3 className="text-2xl text-[#D4A017] mb-4">
                    {capability.title}
                  </h3>
                  <ul className="space-y-2">
                    {(capability.items ?? []).map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#D4A017] mt-2 flex-shrink-0" />
                        <span className="text-white/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {customQuoteCta && (
        <section className="py-20 bg-[#111111]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl text-white mb-6">
                {customQuoteCta.title}
              </h2>
              <p className="text-xl text-white/80 mb-8">
                {customQuoteCta.description}
              </p>
              {customQuoteCta.buttonLabel && (
                <a
                  href={customQuoteCta.buttonHref || "#"}
                  className="inline-block bg-[#D4A017] text-[#111111] px-12 py-5 hover:bg-[#D4A017]/90 transition-colors"
                >
                  {customQuoteCta.buttonLabel}
                </a>
              )}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
