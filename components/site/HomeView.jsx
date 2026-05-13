"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";
import { theme } from "@/constants/theme";
import { toSlug } from "@/lib/slug";
import { resolveImageUrl } from "@/lib/format";
import { toYouTubeEmbedUrl } from "@/lib/youtube";
import { getFavouriteProducts } from "@/services/product";
import { getBlogs } from "@/services/post";

const CUSTOMER_PROJECTS_CATEGORY = "Dự án gia công";

const blogToGridItem = (b) => {
  const slug = toSlug(b?.title ?? "");
  return {
    name: b?.title ?? "",
    image: b?.thumbnail ?? "",
    href: b?.id ? `/tin-tuc/${slug}?id=${b.id}` : `/tin-tuc/${slug}`,
  };
};

const productToGridItem = (p) => {
  const slug = toSlug(p?.title ?? "");
  const image = p?.thumbnail ?? p?.images?.[0] ?? "";
  return {
    name: p?.title ?? "",
    image,
    href: p?.id ? `/san-pham/${slug}?id=${p.id}` : `/san-pham/${slug}`,
  };
};

function ImageGridSection({ section, items, bgClass }) {
  if (!section) return null;
  const list = items ?? section.items ?? [];
  if (list.length === 0) return null;
  return (
    <section className={`py-20 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`${theme.fonts.heading} text-4xl md:text-5xl ${theme.colors.brandText} uppercase mb-3`}>
            {section.title}
          </h2>
          {section.description && (
            <p className="text-lg text-black/70 max-w-2xl mx-auto">{section.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link
                href={item.href ?? `/san-pham/${toSlug(item.name ?? "")}`}
                className="block relative h-72 overflow-hidden"
              >
                <img
                  src={resolveImageUrl(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <p className="text-white font-body text-sm tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.name}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomeView({ content }) {
  const {
    hero,
    hotProducts,
    stats,
    servicesSection,
    panelSamples,
    customerProducts,
    whyChooseUs,
    cta,
  } = content ?? {};

  const [hotItems, setHotItems] = useState([]);
  const [customerItems, setCustomerItems] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getFavouriteProducts();
        if (cancelled) return;
        setHotItems((Array.isArray(list) ? list : []).map(productToGridItem));
      } catch (error) {
        console.error("Error loading favourite products:", error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const page = await getBlogs({ pageNumber: 1, pageSize: 50 });
        if (cancelled) return;
        const items = (page?.items ?? [])
          .filter((b) => b?.categoryName === CUSTOMER_PROJECTS_CATEGORY)
          .map(blogToGridItem);
        setCustomerItems(items.length > 0 ? items : null);
      } catch (error) {
        console.error("Error loading customer projects:", error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>
      {hero && (
        <section className="relative h-screen">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${resolveImageUrl(hero.backgroundImage)}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-transparent" />
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className={`${theme.fonts.heading} ${theme.text.heroTitle} mb-6 text-white`}>{hero.title}</h1>
              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-xl">
                {hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {hero.primaryCta?.label && (
                  <Link
                    href={hero.primaryCta.href || "#"}
                    className={`inline-flex items-center justify-center gap-2 ${theme.colors.brand} ${theme.colors.darkText} px-8 py-4 ${theme.colors.brandHover} transition-colors group`}
                  >
                    {hero.primaryCta.label}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                {hero.secondaryCta?.label && (
                  <Link
                    href={hero.secondaryCta.href || "#"}
                    className={`inline-flex items-center justify-center gap-2 border-2 ${theme.colors.borderBrand} ${theme.colors.brandText} px-8 py-4 ${theme.colors.brandHoverSolid} ${theme.colors.darkTextHover} transition-colors`}
                  >
                    {hero.secondaryCta.label}
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {hotProducts && (
        <ImageGridSection
          section={hotProducts}
          items={hotItems}
          bgClass={theme.colors.bgPrimary}
        />
      )}

      {stats?.length > 0 && (
        <section className={`py-20 ${theme.colors.bgSecondary}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className={`text-5xl md:text-6xl ${theme.colors.brandText} mb-2`}>{stat.number}</div>
                  <div className="text-white/70 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {servicesSection && (
        <section className={`py-20 ${theme.colors.bgPrimary}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-body font-bold tracking-wider text-4xl md:text-5xl text-[#D4A017] uppercase mb-3">{servicesSection.title}</h2>
              <p className="text-xl text-black/70 max-w-2xl mx-auto">
                {servicesSection.description}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Left column - Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative h-[636px] overflow-hidden"
              >
                <img
                  src={resolveImageUrl(servicesSection.image)}
                  alt={servicesSection.imageAlt ?? "Services"}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Right column - Service items stacked */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-6"
              >
                {(servicesSection.items ?? []).map((service, index) => (
                  <div
                    key={index}
                    className="bg-black/80 p-8 rounded"
                  >
                    <h3 className="text-2xl md:text-3xl text-white mb-4">{service.title}</h3>
                    {service.details && Array.isArray(service.details) ? (
                      <ul className="space-y-2">
                        {service.details.map((detail, i) => (
                          <li key={i} className={`${theme.colors.brandText}`}>– {detail}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`${theme.colors.brandText}`}>{service.description}</p>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {panelSamples && (
        <ImageGridSection section={panelSamples} bgClass={theme.colors.bgPrimary} />
      )}

      {customerProducts && (
        <ImageGridSection
          section={customerProducts}
          items={customerItems}
          bgClass={theme.colors.bgPrimary}
        />
      )}

      {whyChooseUs && (
        <section className={`py-20 ${theme.colors.bgSecondary}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl md:text-7xl text-white mb-8">{whyChooseUs.title}</h2>
                <div className="space-y-6">
                  {(whyChooseUs.items ?? []).map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-6 h-6 ${theme.colors.brand} flex items-center justify-center flex-shrink-0 mt-1`}>
                        <Check className={`w-4 h-4 ${theme.colors.darkText}`} />
                      </div>
                      <p className="text-xl text-white/80">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative h-[500px] w-[700px]"
              >
                {whyChooseUs.youtubeUrl ? (
                  <iframe
                    src={toYouTubeEmbedUrl(whyChooseUs.youtubeUrl)}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={resolveImageUrl(whyChooseUs.image)}
                    alt={whyChooseUs.imageAlt ?? ""}
                    className="w-full h-full object-cover"
                  />
                )}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {cta && (
        <section className={`py-24 ${theme.colors.brand}`}>
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-5xl md:text-7xl ${theme.colors.darkText} mb-6`}>{cta.title}</h2>
              <p className={`text-xl ${theme.colors.darkTextSoft} mb-8`}>
                {cta.description}
              </p>
              {cta.buttonLabel && (
                <Link
                  href={cta.buttonHref || "#"}
                  className={`inline-flex items-center justify-center gap-2 ${theme.colors.bgSecondary} ${theme.colors.brandText} px-12 py-5 ${theme.colors.bgPrimaryHover} transition-colors group`}
                >
                  {cta.buttonLabel}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
