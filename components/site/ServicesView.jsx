"use client";

import { motion } from "motion/react";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { theme } from "@/constants/theme";
import { Breadcrumb } from "@/components/breadcrumb";

export default function ServicesView({ content }) {
  const { hero, services, additionalServices, cta, requestQuoteLabel } = content ?? {};

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>
      {hero && (
        <section className="relative h-[60vh] min-h-[500px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${hero.backgroundImage}')` }}
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

      <Breadcrumb items={[{ label: "Dịch vụ" }]} />

      {(services ?? []).map((service, index) => (
        <section
          key={index}
          className={index % 2 === 0 ? `py-20 ${theme.colors.bgPrimary}` : "py-20 bg-[#2B2B2B]"}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={index % 2 === 1 ? "lg:order-2" : ""}
              >
                <h2
                  className={
                    `${theme.fonts.heading} ` +
                    (index % 2 === 0 ? theme.colors.darkText : theme.colors.lightText) +
                    " text-5xl md:text-7xl mb-6"
                  }
                >
                  {service.title}
                </h2>
                <p
                  className={
                    (index % 2 === 0 ? theme.colors.darkTextSoft : theme.colors.lightTextSoft) +
                    " text-xl mb-8"
                  }
                >
                  {service.description}
                </p>

                <div className="space-y-3 mb-8">
                  {(service.features ?? []).map((feature, fi) => (
                    <div key={fi} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4A017] flex-shrink-0 mt-1" />
                      <span
                        className={
                          index % 2 === 0
                            ? theme.colors.darkTextSoft
                            : theme.colors.lightTextSoft
                        }
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {requestQuoteLabel && cta?.primaryButton?.href && (
                  <Link
                    href={cta.primaryButton.href}
                    className="inline-flex items-center gap-2 bg-[#D4A017] text-[#111111] px-8 py-4 hover:bg-[#D4A017]/90 transition-colors group"
                  >
                    {requestQuoteLabel}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative h-[500px] ${index % 2 === 1 ? "lg:order-1" : ""}`}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className={`w-full h-full object-cover ${
                    index % 2 === 0 ? theme.colors.borderDark : ""
                  }`}
                />
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {additionalServices && (
        <section className="py-20 bg-[#111111]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl text-white mb-4">
                {additionalServices.title}
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                {additionalServices.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(additionalServices.items ?? []).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[#2B2B2B] p-8 hover:bg-[#D4A017] hover:text-[#111111] transition-colors group"
                >
                  <h3 className="text-2xl text-white group-hover:text-[#111111] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/70 group-hover:text-[#111111]/80">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {cta && (
        <section className="py-24 bg-[#D4A017]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl text-[#111111] mb-6">{cta.title}</h2>
              <p className="text-xl text-[#111111]/80 mb-8">{cta.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {cta.primaryButton?.label && (
                  <Link
                    href={cta.primaryButton.href || "#"}
                    className="inline-flex items-center justify-center gap-2 bg-[#111111] text-[#D4A017] px-8 py-4 hover:bg-[#111111]/90 transition-colors"
                  >
                    {cta.primaryButton.label}
                  </Link>
                )}
                {cta.secondaryButton?.label && (
                  <Link
                    href={cta.secondaryButton.href || "#"}
                    className="inline-flex items-center justify-center gap-2 border-2 border-[#111111] text-[#111111] px-8 py-4 hover:bg-[#111111] hover:text-[#D4A017] transition-colors"
                  >
                    {cta.secondaryButton.label}
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
