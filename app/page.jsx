"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";
import content from "@/default-content/home.json";
import { theme } from "@/constants/theme";

export default function Home() {
  const { hero, stats, servicesSection, whyChooseUs, cta } = content;

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>
      {/* Hero Section */}
      <section className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${hero.backgroundImage}')`,
          }}
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
              <Link
                href={hero.primaryCta.href}
                className={`inline-flex items-center justify-center gap-2 ${theme.colors.brand} ${theme.colors.darkText} px-8 py-4 ${theme.colors.brandHover} transition-colors group`}
              >
                {hero.primaryCta.label}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className={`inline-flex items-center justify-center gap-2 border-2 ${theme.colors.borderBrand} ${theme.colors.brandText} px-8 py-4 ${theme.colors.brandHoverSolid} ${theme.colors.darkTextHover} transition-colors`}
              >
                {hero.secondaryCta.label}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Services Grid */}
      <section className={`py-20 ${theme.colors.bgPrimary}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl text-white mb-4">{servicesSection.title}</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              {servicesSection.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicesSection.items.map((service, index) => (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>
                <div className="relative h-full flex flex-col justify-end p-8">
                  <h3 className="text-3xl md:text-4xl text-white mb-3">{service.title}</h3>
                  <p className="text-white/80 mb-4">{service.description}</p>
                  <Link
                    href={servicesSection.learnMoreHref}
                    className={`inline-flex items-center gap-2 ${theme.colors.brandText} hover:gap-4 transition-all`}
                  >
                    {servicesSection.learnMoreLabel}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
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
                {whyChooseUs.items.map((item, index) => (
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
              className="relative h-[500px]"
            >
              <img
                src={whyChooseUs.image}
                alt={whyChooseUs.imageAlt}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
            <Link
              href={cta.buttonHref}
              className={`inline-flex items-center justify-center gap-2 ${theme.colors.bgPrimary} ${theme.colors.brandText} px-12 py-5 ${theme.colors.bgPrimaryHover} transition-colors group`}
            >
              {cta.buttonLabel}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
