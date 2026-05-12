"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Calendar, User, ArrowRight } from "lucide-react";
import { theme } from "@/constants/theme";
import { Breadcrumb } from "@/components/breadcrumb";
import { toSlug } from "@/lib/slug";
import { formatDateVN, resolveImageUrl, stripHtml } from "@/lib/format";
import { getBlogs } from "@/services/post";
import { getCategories } from "@/services/category";
import Link from "next/link";

const normalizeApiBlog = (b) => ({
  id: b.id,
  isApi: true,
  title: b.title,
  excerpt: stripHtml(b.description ?? ""),
  image: b.thumbnail ? resolveImageUrl(b.thumbnail) : null,
  category: b.categoryName ?? null,
  categoryId: b.categoryId ?? null,
  date: formatDateVN(b.createdAt) || "",
  author: "",
});

export default function BlogView({ content }) {
  const { hero, featuredLabel, readMoreLabel, posts } = content ?? {};

  const [apiPosts, setApiPosts] = useState(null);
  const [apiCategories, setApiCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [page, catEnvelope] = await Promise.all([
          getBlogs({ pageNumber: 1, pageSize: 50 }),
          getCategories("Blog"),
        ]);
        const items = page?.items ?? [];
        if (!cancelled) {
          setApiPosts(items.map(normalizeApiBlog));
          setApiCategories(catEnvelope?.data ?? []);
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
        if (!cancelled) {
          setApiPosts([]);
          setApiCategories([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const allPosts = apiPosts && apiPosts.length > 0 ? apiPosts : (posts ?? []);
  const blogPosts = useMemo(() => {
    if (!selectedCategoryId) return allPosts;
    return allPosts.filter((p) => p.categoryId === selectedCategoryId);
  }, [allPosts, selectedCategoryId]);
  const featured = blogPosts[0];

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>
      {hero && (
        <section className="relative h-[60vh] min-h-[500px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${resolveImageUrl(hero.backgroundImage)}')` }}
          >
            <div className="absolute inset-0 bg-[#111111]/70" />
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className={`${theme.fonts.heading} ${theme.text.heroTitle} text-white mb-4`}>
                {hero.title}
              </h1>
              <p className="text-xl text-white/80 max-w-2xl">{hero.description}</p>
            </motion.div>
          </div>
        </section>
      )}

      <Breadcrumb items={[{ label: "Tin tức" }]} />

      {apiCategories.length > 0 && (
        <section className="py-8 bg-[#2B2B2B]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`px-6 py-2 transition-colors ${
                  selectedCategoryId === null
                    ? "bg-[#D4A017] text-[#111111]"
                    : "bg-[#111111] text-white hover:bg-[#D4A017] hover:text-[#111111]"
                }`}
              >
                Tất cả
              </button>
              {apiCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`px-6 py-2 transition-colors ${
                    selectedCategoryId === category.id
                      ? "bg-[#D4A017] text-[#111111]"
                      : "bg-[#111111] text-white hover:bg-[#D4A017] hover:text-[#111111]"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {!featured && (
        <section className={`py-20 ${theme.colors.bgPrimary}`}>
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-white/60">Chưa có bài viết nào.</p>
          </div>
        </section>
      )}

      {featured && (
        <section className={`pt-12 ${theme.colors.bgPrimary}`}>
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#2B2B2B]"
            >
              <div className="relative h-96 lg:h-auto">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />
                {featuredLabel && (
                  <div className="absolute top-4 left-4 bg-[#D4A017] text-[#111111] px-4 py-2">
                    {featuredLabel}
                  </div>
                )}
              </div>

              <div className="p-8 lg:p-12 flex flex-col justify-center">
                {featured.category && (
                  <div className="inline-block bg-[#D4A017] text-[#111111] px-3 py-1 text-sm mb-4 w-fit">
                    {featured.category}
                  </div>
                )}
                <h2 className="text-4xl md:text-5xl text-white mb-4">{featured.title}</h2>
                <p className="text-xl text-white/70 mb-6">{featured.excerpt}</p>

                <div className="flex items-center gap-6 mb-8 text-white/60">
                  {featured.date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{featured.date}</span>
                    </div>
                  )}
                  {featured.author && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{featured.author}</span>
                    </div>
                  )}
                </div>

                {readMoreLabel && (
                  <button className="inline-flex items-center gap-2 text-[#D4A017] hover:gap-4 transition-all">
                    {readMoreLabel}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {blogPosts.length > 1 && (
        <section className={`py-12 ${theme.colors.bgPrimary}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1).map((post, index) => {
                const slug = toSlug(post.title);
                const href = post.isApi
                  ? `/tin-tuc/${slug}?id=${post.id}`
                  : `/tin-tuc/${slug}`;
                return (
                  <Link key={post.id ?? index} href={href}>
                    <motion.article
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-[#2B2B2B] overflow-hidden group cursor-pointer"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {post.category && (
                          <div className="absolute top-4 left-4 bg-[#D4A017] text-[#111111] px-3 py-1 text-sm">
                            {post.category}
                          </div>
                        )}
                      </div>

                      <div className="p-6 min-h-88">
                        <h3 className="text-2xl text-white mb-3 group-hover:text-[#D4A017] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-white/70 mb-4">{post.excerpt}</p>

                        <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                          {post.date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{post.date}</span>
                            </div>
                          )}
                        </div>

                        {readMoreLabel && (
                          <button className="inline-flex items-center gap-2 text-[#D4A017] hover:gap-4 transition-all">
                            {readMoreLabel}
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.article>
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
