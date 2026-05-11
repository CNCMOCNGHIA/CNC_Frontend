"use client";

import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { theme } from "@/constants/theme";
import { Breadcrumb } from "@/components/breadcrumb";
import Link from "next/link";
import { getBlog, getBlogs } from "@/services/post";
import { formatDateVN, resolveImageUrl } from "@/lib/format";
import { toSlug } from "@/lib/slug";
import { embedYouTubeLinks } from "@/lib/youtube";

const RECENT_SIDEBAR_TITLE = "Bài viết khác";
const FALLBACK_HERO = "/images/trang-chu.jpeg";

export default function BlogDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [apiBlog, setApiBlog] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
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
        if (!cancelled) setRecent(items);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
        if (!cancelled) setRecent([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className={`${theme.colors.bgPrimary} min-h-[60vh] flex items-center justify-center`}>
        <p className="text-white/60">Đang tải bài viết...</p>
      </div>
    );
  }

  if (!apiBlog) {
    return (
      <div className={`${theme.colors.bgPrimary} min-h-[60vh] flex items-center justify-center`}>
        <p className="text-white/60">Không tìm thấy bài viết.</p>
      </div>
    );
  }

  const title = apiBlog.title ?? "";
  const category = apiBlog.categoryName ?? apiBlog.category?.name ?? "Tin tức";
  const heroImage = apiBlog.thumbnail
    ? resolveImageUrl(apiBlog.thumbnail)
    : FALLBACK_HERO;
  const date = formatDateVN(apiBlog.createdAt) || "";
  const descriptionHtml = embedYouTubeLinks(apiBlog.description ?? "");

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
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
            <div className="inline-block bg-[#D4A017] text-[#111111] px-4 py-2 text-sm mb-6 w-fit">
              {category}
            </div>

            <h1 className={`${theme.fonts.heading} text-5xl md:text-6xl text-white leading-tight mb-6`}>
              {title}
            </h1>

            {date && (
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-5 h-5" />
                <span>{date}</span>
              </div>
            )}
          </motion.div>
        </div>

        <div className="absolute inset-0 border-b-2 border-white/20 pointer-events-none" />
      </section>

      <Breadcrumb
        items={[
          { label: "Tin tức", href: "/tin-tuc" },
          { label: title },
        ]}
      />

      {/* ── Content + Sidebar ────────────────────────────────────────── */}
      <section className={`${theme.colors.bgPrimary} py-8 px-4`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
          {/* ── Main content (HTML từ Quill — đã được chèn bởi admin đã xác thực) ── */}
          <article className="flex-1 min-w-0 bg-[#2B2B2B] p-8 text-white/80 blog-content">
            <div
              className="prose prose-invert max-w-none text-xl leading-relaxed"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          </article>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-[400px] shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#2B2B2B] p-6 flex flex-col gap-6 sticky top-[140px]"
            >
              <div>
                <div className="w-[200px] h-[5px] bg-[#D9D9D9] mb-5" />
                <h3 className={`${theme.fonts.heading} text-3xl text-white`}>
                  {RECENT_SIDEBAR_TITLE}
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                {recent.length === 0 ? (
                  <p className="text-white/60 text-sm">Chưa có bài viết khác.</p>
                ) : (
                  recent.map((rPost, index) => (
                    <motion.div
                      key={rPost.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href={`/tin-tuc/${toSlug(rPost.title)}?id=${rPost.id}`}
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
                  ))
                )}
              </div>
            </motion.div>
          </aside>
        </div>
      </section>
    </div>
  );
}
