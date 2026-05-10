"use client";

import { motion } from "motion/react";
import { Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import content from "@/default-content/tin-tuc-detail.json";
import { theme } from "@/constants/theme";
import { Breadcrumb } from "@/components/breadcrumb";
import Link from "next/link";
import { getBlog, getBlogs } from "@/services/post";
import { formatDateVN, resolveImageUrl } from "@/lib/format";
import { toSlug } from "@/lib/slug";

const mergeBlog = (template, apiBlog) => {
  if (!apiBlog) return template;
  const heroImage = apiBlog.thumbnail
    ? resolveImageUrl(apiBlog.thumbnail)
    : template.heroImage;
  const mainImage = Array.isArray(apiBlog.images) && apiBlog.images.length
    ? resolveImageUrl(apiBlog.images[0])
    : heroImage ?? template.mainImage;
  const date = formatDateVN(apiBlog.createdAt) || template.date;
  return {
    ...template,
    title: apiBlog.title ?? template.title,
    excerpt: apiBlog.description ?? template.excerpt,
    category: apiBlog.categoryName ?? template.category,
    heroImage,
    mainImage,
    date,
  };
};

export default function BlogDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [apiBlog, setApiBlog] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [recentFromApi, setRecentFromApi] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await getBlog(id);
        if (!cancelled) setApiBlog(data ?? null);
      } catch (error) {
        console.error("Error fetching blog:", error);
        if (!cancelled) setApiBlog(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const page = await getBlogs({ pageNumber: 1, pageSize: 6 });
        const items = (page?.items ?? [])
          .filter((b) => b.id !== id)
          .slice(0, 4)
          .map((b) => ({
            id: b.id,
            title: b.title,
            image: b.thumbnail ? resolveImageUrl(b.thumbnail) : null,
            date: formatDateVN(b.createdAt) || "",
          }));
        if (!cancelled) setRecentFromApi(items);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
        if (!cancelled) setRecentFromApi([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const post = mergeBlog(content.post, apiBlog);
  const { recentPosts, recentPostsTitle } = content;
  const useApiRecent = recentFromApi !== null && recentFromApi.length > 0;
  const recentItems = useApiRecent ? recentFromApi : recentPosts;

  if (loading) {
    return (
      <div className={`${theme.colors.bgPrimary} min-h-[60vh] flex items-center justify-center`}>
        <p className="text-white/60">Đang tải bài viết...</p>
      </div>
    );
  }

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>

      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${post.heroImage}')` }}
        >
          <div className="absolute inset-0 bg-[#111111]/70" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-end pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            {/* Category badge */}
            <div className="inline-block bg-[#D4A017] text-[#111111] px-4 py-2 text-sm mb-6 w-fit">
              {post.category}
            </div>

            {/* Title */}
            <h1 className={`${theme.fonts.heading} text-5xl md:text-6xl text-white leading-tight mb-6`}>
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{post.author}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-0 border-b-2 border-white/20 pointer-events-none" />
      </section>

      <Breadcrumb
        items={[
          { label: "Tin tức", href: "/tin-tuc" },
          { label: post.title },
        ]}
      />

      {/* ── Content + Sidebar ────────────────────────────────────────── */}
      <section className={`${theme.colors.bgPrimary} py-8 px-4`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Main content ── */}
          <div className="flex-1 flex flex-col gap-0 min-w-0">

            {post.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Text-only section */}
                {section.type === "text" && (
                  <div className="bg-[#2B2B2B] p-8">
                    <h2 className="text-2xl text-white font-bold mb-4">{section.title}</h2>
                    <p className="text-white/80 text-xl leading-relaxed">{section.content}</p>
                  </div>
                )}

                {/* Image break between sections */}
                {index === 0 && (
                  <div className="relative w-full h-[360px] overflow-hidden border border-black">
                    <img
                      src={post.mainImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* List section */}
                {section.type === "list" && (
                  <div className="bg-[#2B2B2B] p-8">
                    <h2 className="text-2xl md:text-3xl text-white font-bold mb-5">{section.title}</h2>
                    <ul className="space-y-2 text-white/80 list-disc list-inside">
                      {section.items.map((item) => (
                        <li key={item} className="text-xl leading-9">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Text + nested list section */}
                {section.type === "text-list" && (
                  <div className="bg-[#2B2B2B] p-8">
                    <h2 className="text-2xl md:text-3xl text-white font-bold mb-5">{section.title}</h2>
                    <ul className="space-y-3 text-white/80 list-disc list-inside">
                      <li className="text-xl leading-9">{section.content}</li>
                      <li className="text-xl leading-9">
                        {section.subTitle}
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                          {section.subItems.map((item) => (
                            <li key={item} className="text-xl">{item}</li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-[400px] shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#2B2B2B] p-6 flex flex-col gap-6 sticky top-[140px]"
            >
              {/* Sidebar title */}
              <div>
                <div className="w-[200px] h-[5px] bg-[#D9D9D9] mb-5" />
                <h3 className={`${theme.fonts.heading} text-3xl text-white`}>
                  {recentPostsTitle}
                </h3>
              </div>

              {/* Recent post cards */}
              <div className="flex flex-col gap-4">
                {recentItems.map((rPost, index) => {
                  const href = useApiRecent
                    ? `/tin-tuc/${toSlug(rPost.title)}?id=${rPost.id}`
                    : `/tin-tuc/${rPost.slug}`;
                  return (
                    <motion.div
                      key={rPost.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href={href}
                        className={`flex gap-3 items-start p-3 rounded-2xl transition-colors ${
                          index === 0 ? "bg-[#111111]" : "bg-[#3A3A3A] hover:bg-[#111111]"
                        }`}
                      >
                        <div className="relative shrink-0 w-[100px] h-[100px] rounded-2xl overflow-hidden">
                          {rPost.image ? (
                            <img
                              src={rPost.image}
                              alt={rPost.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#2B2B2B]" />
                          )}
                        </div>
                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                          <p className="text-white font-semibold text-lg leading-snug line-clamp-2">
                            {rPost.title}
                          </p>
                          {rPost.date && (
                            <div className="flex items-center gap-2 text-white/60">
                              <Calendar className="w-4 h-4 shrink-0" />
                              <span className="text-sm">{rPost.date}</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </aside>
        </div>
      </section>
    </div>
  );
}