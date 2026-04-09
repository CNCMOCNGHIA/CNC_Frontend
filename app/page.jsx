"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  const services = [
    {
      title: "CNC CUTTING",
      description: "Precision CNC cutting for wood panels and furniture components",
      image: "https://images.unsplash.com/photo-1693948568453-a3564f179a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDTkMlMjBjdXR0aW5nJTIwd29vZCUyMHBhbmVsfGVufDF8fHx8MTc3MzY0NTMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      title: "PUR EDGE BANDING",
      description: "High-quality edge banding with PUR adhesive for durability",
      image: "https://images.unsplash.com/photo-1642381071059-7a8c84c197ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGdlJTIwYmFuZGluZyUyMG1hY2hpbmV8ZW58MXx8fHwxNzczNjQ1MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      title: "MDF BENDING",
      description: "Specialized MDF bending for curved furniture designs",
      image: "https://images.unsplash.com/photo-1759159091728-e2c87b9d9315?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVjaXNpb24lMjBtYWNoaW5lcnklMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc3MzY0NTMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      title: "DRILLING & ROUTING",
      description: "Precision drilling and handle routing for cabinet hardware",
      image: "https://images.unsplash.com/photo-1764115424769-ebdd2683d5a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDTkMlMjBtYWNoaW5lJTIwaW5kdXN0cmlhbCUyMGZhY3Rvcnl8ZW58MXx8fHwxNzczNjQ1MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const stats = [
    { number: "15+", label: "Years Experience" },
    { number: "500+", label: "Projects Completed" },
    { number: "100+", label: "B2B Partners" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1769430838012-8e1270d41f46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwZnVybml0dXJlJTIwbWFudWZhY3R1cmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MzY0NTMzNHww&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/95 via-[#111111]/80 to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl md:text-8xl mb-6 text-white">
              PRECISION CNC FURNITURE MANUFACTURING
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-xl">
              Your trusted B2B partner for professional CNC processing, edge banding, and custom furniture production.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 bg-[#D4A017] text-[#111111] px-8 py-4 hover:bg-[#D4A017]/90 transition-colors group"
              >
                REQUEST QUOTE
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#D4A017] text-[#D4A017] px-8 py-4 hover:bg-[#D4A017] hover:text-[#111111] transition-colors"
              >
                OUR SERVICES
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#2B2B2B]">
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
                <div className="text-5xl md:text-6xl text-[#D4A017] mb-2">{stat.number}</div>
                <div className="text-white/70 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl text-white mb-4">OUR SERVICES</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Comprehensive CNC processing solutions for furniture manufacturers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative h-96 overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${service.image}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent" />
                </div>
                <div className="relative h-full flex flex-col justify-end p-8">
                  <h3 className="text-3xl md:text-4xl text-white mb-3">{service.title}</h3>
                  <p className="text-white/80 mb-4">{service.description}</p>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 text-[#D4A017] hover:gap-4 transition-all"
                  >
                    LEARN MORE
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-[#2B2B2B]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl text-white mb-8">WHY CHOOSE US</h2>
              <div className="space-y-6">
                {[
                  "Advanced CNC machinery and equipment",
                  "ISO certified manufacturing processes",
                  "Experienced technical team",
                  "Fast turnaround times",
                  "Competitive B2B pricing",
                  "Quality assurance guaranteed",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-[#D4A017] flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-[#111111]" />
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
              className="relative h-[500px]"
            >
              <img
                src="https://images.unsplash.com/photo-1615990860014-99e51245218c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbmR1c3RyaWFsJTIwd29ya3Nob3B8ZW58MXx8fHwxNzczNjQ1MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern industrial workshop"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#D4A017]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl text-[#111111] mb-6">
              READY TO START YOUR PROJECT?
            </h2>
            <p className="text-xl text-[#111111]/80 mb-8">
              Upload your CAD files and get a detailed quote within 24 hours
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 bg-[#111111] text-[#D4A017] px-12 py-5 hover:bg-[#111111]/90 transition-colors group"
            >
              SEND FILES & REQUEST QUOTE
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
