"use client";

import { motion } from "motion/react";
import { Award, Users, Target, Factory } from "lucide-react";
import content from "@/default-content/gioi-thieu.json";
import { theme } from "@/constants/theme";

export default function About() {
  const iconMap = {
    award: Award,
    users: Users,
    target: Target,
    factory: Factory,
  };

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

      {/* Company Overview */}
      <section className="py-12 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl text-black mb-6">{content.story.title}</h2>
              <div className="space-y-4 text-black/80">
                {content.story.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
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
                src={content.story.image}
                alt={content.story.imageAlt}
                className={`w-full h-full object-cover ${theme.colors.borderDark} `}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-[#2B2B2B]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl text-white mb-4">{content.values.title}</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              {content.values.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.values.items.map((value, index) => {
              const Icon = iconMap[value.icon];
              return (
              <motion.div
                key={`${value.title}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#111111] p-8 hover:bg-[#D4A017] hover:text-[#111111] transition-colors group"
              >
                {Icon ? <Icon className="w-12 h-12 mb-6 text-[#D4A017] group-hover:text-[#111111]" /> : null}
                <h3 className="text-2xl text-white group-hover:text-[#111111] mb-3">{value.title}</h3>
                <p className="text-white/70 group-hover:text-[#111111]/80">{value.description}</p>
              </motion.div>
            )})}
          </div>
        </div>
      </section>

      {/* Machinery & Equipment */}
      <section className={`py-12 ${theme.colors.bgPrimary}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-7xl ${theme.colors.darkText} mb-4`}>{content.machinery.title}</h2>
            <p className={`text-xl ${theme.colors.darkTextSoft} max-w-2xl mx-auto`}>
              {content.machinery.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.machinery.items.map((machine, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#2B2B2B] overflow-hidden group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={machine.image}
                    alt={machine.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl text-white">{machine.name}</h3>
                    <span className="text-[#D4A017] whitespace-nowrap">{machine.quantity}</span>
                  </div>
                  <p className="text-white/70">{machine.specs}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Factory Info */}
      <section className="py-20 bg-[#2B2B2B]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px]"
            >
              <img
                src={content.facility.image}
                alt={content.facility.imageAlt}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl text-white mb-6">{content.facility.title}</h2>
              <div className="space-y-6">
                {content.facility.items.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="border-l-4 border-[#D4A017] pl-6">
                    <h3 className="text-2xl text-white mb-2">{item.title}</h3>
                    <p className="text-white/70">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
