"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Phone, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { theme } from "@/constants/theme";
import { Breadcrumb } from "@/components/breadcrumb";
import { getProduct, getProducts } from "@/services/product";
import { formatVND, resolveImageUrl } from "@/lib/format";
import { toSlug } from "@/lib/slug";
import { embedYouTubeLinks } from "@/lib/youtube";

const CONTACT_LABEL = "LIÊN HỆ";
const ORDER_LABEL = "ĐẶT HÀNG";
const RELATED_TITLE = "CÁC SẢN PHẨM TƯƠNG TỰ";
const FALLBACK_IMAGE = "/images/trang-chu.jpeg";

const buildImages = (apiProduct) => {
  if (Array.isArray(apiProduct?.images) && apiProduct.images.length) {
    return apiProduct.images.map(resolveImageUrl);
  }
  if (apiProduct?.thumbnail) return [resolveImageUrl(apiProduct.thumbnail)];
  return [FALLBACK_IMAGE];
};

export default function ProductDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [apiProduct, setApiProduct] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [activeThumb, setActiveThumb] = useState(0);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await getProduct(id);
        if (!cancelled) {
          setApiProduct(data ?? null);
          setActiveThumb(0);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        if (!cancelled) setApiProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!apiProduct) return;
    let cancelled = false;
    (async () => {
      try {
        const categoryId = apiProduct.category?.id;
        const page = await getProducts({
          pageNumber: 1,
          pageSize: 6,
          ...(categoryId ? { categoryId } : {}),
        });
        const items = (page?.items ?? [])
          .filter((p) => p.id !== apiProduct.id)
          .slice(0, 3);
        if (!cancelled) setRelated(items);
      } catch (error) {
        console.error("Error fetching related products:", error);
        if (!cancelled) setRelated([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiProduct]);

  if (loading) {
    return (
      <div className={`${theme.colors.bgPrimary} min-h-[60vh] flex items-center justify-center`}>
        <p className="text-white/60">Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (!apiProduct) {
    return (
      <div className={`${theme.colors.bgPrimary} min-h-[60vh] flex items-center justify-center`}>
        <p className="text-white/60">Không tìm thấy sản phẩm.</p>
      </div>
    );
  }

  const name = apiProduct.title ?? "";
  const subtitle = apiProduct.subtitle ?? "";
  const category = apiProduct.category?.name ?? "Sản phẩm";
  const priceNum = Number(apiProduct.price);
  const priceText = Number.isFinite(priceNum) && priceNum > 0
    ? formatVND(priceNum)
    : "Liên hệ";
  const images = buildImages(apiProduct);
  const descriptionHtml = embedYouTubeLinks(apiProduct.description ?? "");

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>
      {/* ── Gallery ─────────────────────────────────────────────────── */}
      <section className="bg-[#111111]">
        <div className="relative w-full h-[60vh] min-h-[500px] overflow-hidden">
          <motion.img
            key={activeThumb}
            src={images[activeThumb]}
            alt={name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 border-b-2 border-white/20 pointer-events-none" />
        </div>

        {images.length > 1 && (
          <div className="flex items-center justify-center gap-4 py-5 bg-[#111111] px-8">
            <button
              onClick={() => setActiveThumb((p) => Math.max(0, p - 1))}
              className="text-white/50 hover:text-white transition-colors shrink-0"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <div className="flex gap-4 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className="relative shrink-0 w-[180px] h-[110px] overflow-hidden"
                >
                  <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
                  <div
                    className={`absolute inset-0 border-2 transition-colors ${
                      i === activeThumb ? "border-[#D4A017]" : "border-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveThumb((p) => Math.min(images.length - 1, p + 1))}
              className="text-white/50 hover:text-white transition-colors shrink-0"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        )}
      </section>

      <Breadcrumb
        items={[
          { label: "Sản phẩm", href: "/san-pham" },
          { label: name },
        ]}
      />

      {/* ── Product Header ───────────────────────────────────────────── */}
      <section className="bg-[#2B2B2B] py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <div className="inline-block bg-[#D4A017] text-[#111111] px-5 py-1 text-sm font-semibold w-fit">
              {category}
            </div>
            <h1 className={`${theme.fonts.heading} text-5xl md:text-6xl text-white leading-tight`}>
              {name}
            </h1>
            {subtitle && (
              <p className="text-white/70 text-xl max-w-2xl">{subtitle}</p>
            )}
            <p className={`${theme.fonts.heading} text-4xl text-[#D4A017]`}>
              {priceText}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <a
              href="tel:+84123456789"
              className="flex items-center gap-2 bg-red-600 text-white px-10 py-5 hover:bg-red-700 transition-colors font-semibold whitespace-nowrap"
            >
              <Phone className="w-5 h-5" />
              {CONTACT_LABEL}
            </a>
            <button className="flex items-center gap-2 bg-red-600 text-white px-10 py-5 cursor-pointer hover:bg-red-700 transition-colors font-semibold whitespace-nowrap">
              <ShoppingCart className="w-5 h-5" />
              {ORDER_LABEL}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Detail body (HTML từ Quill — admin đã xác thực) ───────────── */}
      {descriptionHtml && (
        <section className={`${theme.colors.bgPrimary} py-12 px-4`}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#2B2B2B] p-8 text-white/80 product-content"
            >
              <div
                className="prose prose-invert max-w-none text-xl leading-relaxed"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Related Products ─────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className={`py-20 ${theme.colors.bgSecondary} px-4`}>
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <div className="w-[200px] h-[5px] bg-[#D9D9D9] mb-5" />
              <h2 className={`${theme.fonts.heading} text-4xl md:text-5xl text-white`}>
                {RELATED_TITLE}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((rawItem, index) => {
                const item = {
                  id: rawItem.id,
                  name: rawItem.title,
                  description: rawItem.subtitle ?? "",
                  image: resolveImageUrl(rawItem.thumbnail ?? rawItem.images?.[0] ?? ""),
                  price: Number(rawItem.price ?? 0),
                };
                const slug = toSlug(item.name ?? "");
                return (
                  <Link key={item.id} href={`/san-pham/${slug}?id=${item.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-[#111111] overflow-hidden group cursor-pointer h-full"
                    >
                      <div className="relative h-64 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#2B2B2B]" />
                        )}
                      </div>
                      <div className="p-7">
                        <h3 className="text-2xl text-white font-bold mb-2 group-hover:text-[#D4A017] transition-colors">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-white/70 mb-4 line-clamp-2">{item.description}</p>
                        )}
                        <p className="text-xl text-[#D4A017] font-semibold">
                          {Number.isFinite(item.price) && item.price > 0
                            ? formatVND(item.price)
                            : "Liên hệ"}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
