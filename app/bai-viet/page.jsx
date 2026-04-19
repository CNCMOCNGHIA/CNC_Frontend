"use client";

import { motion } from "motion/react";
import { Calendar, User, ArrowRight } from "lucide-react";
import content from "@/default-content/bai-viet.json";
import { theme } from "@/constants/theme";
import { toSlug } from '@/lib/slug';
import Link from "next/link";
export default function Blog() {
  const blogPosts = content.posts;
  const categories = content.categories;

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${content.hero.backgroundImage}')`,
          }}
        >
          <div className="absolute inset-0 bg-[#111111]/70" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={`${theme.fonts.heading} ${theme.text.heroTitle} text-white mb-4`}>{content.hero.title}</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              {content.hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-[#2B2B2B]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 bg-[#111111] text-white hover:bg-[#D4A017] hover:text-[#111111] transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#2B2B2B]"
          >
            <div className="relative h-96 lg:h-auto">
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#D4A017] text-[#111111] px-4 py-2">
                {content.featuredLabel}
              </div>
            </div>

            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="inline-block bg-[#D4A017] text-[#111111] px-3 py-1 text-sm mb-4 w-fit">
                {blogPosts[0].category}
              </div>
              <h2 className="text-4xl md:text-5xl text-white mb-4">{blogPosts[0].title}</h2>
              <p className="text-xl text-white/70 mb-6">{blogPosts[0].excerpt}</p>

              <div className="flex items-center gap-6 mb-8 text-white/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{blogPosts[0].date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{blogPosts[0].author}</span>
                </div>
              </div>

              <button className="inline-flex items-center gap-2 text-[#D4A017] hover:gap-4 transition-all">
                {content.readMoreLabel}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    
            {blogPosts.slice(1).map((post, index) => {
              const slug = toSlug(post.title);
              return (
                <Link key={post.id} href={`/bai-viet/${slug}`}>
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
                      <div className="absolute top-4 left-4 bg-[#D4A017] text-[#111111] px-3 py-1 text-sm">
                        {post.category}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl text-white mb-3 group-hover:text-[#D4A017] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-white/70 mb-4">{post.excerpt}</p>

                      <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                      </div>

                      <button className="inline-flex items-center gap-2 text-[#D4A017] hover:gap-4 transition-all">
                        {content.readMoreLabel}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-[#2B2B2B]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl text-white mb-6">
              {content.newsletter.title}
            </h2>
            <p className="text-xl text-white/70 mb-8">
              {content.newsletter.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                placeholder={content.newsletter.placeholder}
                className="flex-grow bg-[#111111] border border-white/10 text-white px-6 py-4 focus:border-[#D4A017] focus:outline-none"
              />
              <button className="bg-[#D4A017] text-[#111111] px-8 py-4 hover:bg-[#D4A017]/90 transition-colors whitespace-nowrap">
                {content.newsletter.buttonLabel}
              </button>
            </div>

            <p className="text-white/50 text-sm mt-4">
              {content.newsletter.note}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
