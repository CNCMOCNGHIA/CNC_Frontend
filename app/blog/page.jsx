"use client";

import { motion } from "motion/react";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "5 Benefits of PUR Edge Banding Over EVA Adhesive",
      excerpt: "Discover why PUR (Polyurethane Reactive) adhesive is becoming the industry standard for high-quality furniture manufacturing.",
      image: "https://images.unsplash.com/photo-1642381071059-7a8c84c197ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGdlJTIwYmFuZGluZyUyMG1hY2hpbmV8ZW58MXx8fHwxNzczNjQ1MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Manufacturing",
      date: "March 10, 2026",
      author: "Technical Team",
    },
    {
      id: 2,
      title: "Optimizing CAD Files for CNC Production",
      excerpt: "Best practices for preparing your design files to minimize waste and reduce manufacturing costs.",
      image: "https://images.unsplash.com/photo-1693948568453-a3564f179a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDTkMlMjBjdXR0aW5nJTIwd29vZCUyMHBhbmVsfGVufDF8fHx8MTc3MzY0NTMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Design Tips",
      date: "March 5, 2026",
      author: "Design Department",
    },
    {
      id: 3,
      title: "Material Selection Guide for Furniture Manufacturing",
      excerpt: "Understanding the differences between MDF, plywood, and chipboard for various furniture applications.",
      image: "https://images.unsplash.com/photo-1769430838012-8e1270d41f46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwZnVybml0dXJlJTIwbWFudWZhY3R1cmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MzY0NTMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Materials",
      date: "February 28, 2026",
      author: "Production Manager",
    },
    {
      id: 4,
      title: "Industry 4.0: How CNC Technology is Transforming Furniture Manufacturing",
      excerpt: "Exploring the latest advancements in CNC automation and what it means for furniture production efficiency.",
      image: "https://images.unsplash.com/photo-1764115424769-ebdd2683d5a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDTkMlMjBtYWNoaW5lJTIwaW5kdXN0cmlhbCUyMGZhY3Rvcnl8ZW58MXx8fHwxNzczNjQ1MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Industry Trends",
      date: "February 20, 2026",
      author: "Technical Team",
    },
    {
      id: 5,
      title: "Quality Control in CNC Furniture Processing",
      excerpt: "Our multi-stage quality assurance process ensuring precision and consistency in every project.",
      image: "https://images.unsplash.com/photo-1759159091728-e2c87b9d9315?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVjaXNpb24lMjBtYWNoaW5lcnklMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc3MzY0NTMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Quality",
      date: "February 15, 2026",
      author: "QC Department",
    },
    {
      id: 6,
      title: "Sustainable Practices in CNC Manufacturing",
      excerpt: "How we minimize waste and maximize material efficiency through advanced nesting software and recycling programs.",
      image: "https://images.unsplash.com/photo-1615990860014-99e51245218c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbmR1c3RyaWFsJTIwd29ya3Nob3B8ZW58MXx8fHwxNzczNjQ1MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Sustainability",
      date: "February 10, 2026",
      author: "Operations",
    },
  ];

  const categories = ["All", "Manufacturing", "Design Tips", "Materials", "Industry Trends", "Quality", "Sustainability"];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1768054948628-82319724f0b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwZXF1aXBtZW50JTIwbWFjaGluZXJ5fGVufDF8fHx8MTc3MzU0MTk3Nnww&ixlib=rb-4.1.0&q=80&w=1080')`,
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
            <h1 className="text-6xl md:text-8xl text-white mb-4">BLOG & INSIGHTS</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Industry knowledge, technical guides, and manufacturing insights
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
                FEATURED
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
                READ MORE
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
            {blogPosts.slice(1).map((post, index) => (
              <motion.article
                key={post.id}
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
                    READ MORE
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.article>
            ))}
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
              STAY UPDATED
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Subscribe to our newsletter for industry insights and manufacturing tips
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow bg-[#111111] border border-white/10 text-white px-6 py-4 focus:border-[#D4A017] focus:outline-none"
              />
              <button className="bg-[#D4A017] text-[#111111] px-8 py-4 hover:bg-[#D4A017]/90 transition-colors whitespace-nowrap">
                SUBSCRIBE
              </button>
            </div>
            
            <p className="text-white/50 text-sm mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
