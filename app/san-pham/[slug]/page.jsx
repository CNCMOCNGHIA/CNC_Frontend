"use client";

import { motion } from "motion/react";
import { Phone, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import content from "@/default-content/san-pham-detail.json";
import { theme } from "@/constants/theme";

export default function ProductDetail() {
  const { product, relatedProducts, contactLabel, orderLabel, relatedTitle } = content;
  const [activeThumb, setActiveThumb] = useState(0);

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>

      {/* ── Gallery ─────────────────────────────────────────────────── */}
      <section className="bg-[#111111]">
        {/* Main image */}
        <div className="relative w-full h-[60vh] min-h-[500px] overflow-hidden">
          <motion.img
            key={activeThumb}
            src={product.images[activeThumb]}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 border-b-2 border-white/20 pointer-events-none" />
        </div>

        {/* Thumbnail strip */}
        <div className="flex items-center justify-center gap-4 py-5 bg-[#111111] px-8">
          <button
            onClick={() => setActiveThumb((p) => Math.max(0, p - 1))}
            className="text-white/50 hover:text-white transition-colors shrink-0"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="flex gap-4 overflow-x-auto">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveThumb(i)}
                className="relative shrink-0 w-[180px] h-[110px] overflow-hidden"
              >
                <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                <div
                  className={`absolute inset-0 border-2 transition-colors ${
                    i === activeThumb ? "border-[#D4A017]" : "border-white/20"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            onClick={() => setActiveThumb((p) => Math.min(product.images.length - 1, p + 1))}
            className="text-white/50 hover:text-white transition-colors shrink-0"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </section>

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
              {product.category}
            </div>
            <h1 className={`${theme.fonts.heading} text-5xl md:text-6xl text-white leading-tight`}>
              {product.name}
            </h1>
            <p className={`${theme.fonts.heading} text-4xl text-[#D4A017]`}>
              {product.price}
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
              {contactLabel}
            </a>
            <button className="flex items-center gap-2 bg-red-600 text-white px-10 py-5 cursor-pointer hover:bg-red-700 transition-colors font-semibold whitespace-nowrap">
              <ShoppingCart className="w-5 h-5" />
              {orderLabel}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Detail Sections ──────────────────────────────────────────── */}
      <section className={`${theme.colors.bgPrimary} py-12 px-4`}>
        <div className="max-w-7xl mx-auto flex flex-col gap-0">

          {/* Section 1 – Thông tin chính */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#2B2B2B] p-8"
          >
            <h2 className="text-4xl text-white font-bold mb-5">{product.mainInfo.title}</h2>
            <ul className="space-y-2 text-white/80 list-disc list-inside text-xl">
              <li>Tên sản phẩm: {product.mainInfo.productFullName}</li>
              <li>Mô tả ngắn: {product.mainInfo.shortDescription}</li>
              <li>
                CTA:
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  {product.mainInfo.cta.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            </ul>
          </motion.div>

          {/* Main image */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`relative w-full h-[400px] overflow-hidden justify-items-center ${theme.colors.bgSecondary}`}
          >
            <img src={product.mainImage} alt={product.name} className="w-[800px] h-full object-cover" />
          </motion.div>

          {/* Section 2 – Thông số */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#2B2B2B] p-8"
          >
            <h2 className="text-4xl md:text-3xl text-white font-bold mb-5">{product.specs.title}</h2>
            <ul className="space-y-2 text-white/80 list-disc list-inside">
              {product.specs.items.map((item) => (
                <li key={item} className="text-xl leading-9">{item}</li>
              ))}
            </ul>
          </motion.div>

          {/* Section 3 – Mô tả */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#2B2B2B] p-8"
          >
            <h2 className="text-4xl md:text-3xl text-white font-bold mb-5">{product.description.title}</h2>
            <ul className="space-y-3 text-white/80 list-disc list-inside">
              <li className="text-xl leading-9">{product.description.content}</li>
              <li className="text-xl leading-9">
                Sản phẩm phù hợp với:
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  {product.description.suitableFor.map((item) => (
                    <li key={item} className="text-xl">{item}</li>
                  ))}
                </ul>
              </li>
            </ul>
          </motion.div>

          {/* Section 4 – Chính sách */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#2B2B2B] p-8"
          >
            <h2 className="text-4xl md:text-3xl text-white font-bold mb-5">{product.policy.title}</h2>
            <ul className="space-y-2 text-white/80 list-disc list-inside">
              {product.policy.items.map((item) => (
                <li key={item} className="text-xl leading-9">{item}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── Related Products ─────────────────────────────────────────── */}
      <section className={`py-20 ${theme.colors.bgSecondary} px-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <div className="w-[200px] h-[5px] bg-[#D9D9D9] mb-5" />
            <h2 className={`${theme.fonts.heading} text-4xl md:text-5xl text-white`}>
              {relatedTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#111111] overflow-hidden group cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-7">
                  <h3 className="text-2xl text-white font-bold mb-2 group-hover:text-[#D4A017] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-white/70 mb-4">{item.description}</p>
                  <div className="space-y-2">
                    {item.specs.map((spec) => (
                      <div key={spec} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#D4A017] shrink-0" />
                        <span className="text-sm text-white/60">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}