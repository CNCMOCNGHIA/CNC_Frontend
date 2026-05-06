"use client";

import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { theme } from "@/constants/theme";
import { Breadcrumb } from "@/components/breadcrumb";

const ICON_MAP = { MapPin, Phone, Mail, Clock };

export default function ContactView({ content }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { hero, contactInfo, quickContact, contactForm, map, infoCards } = content ?? {};
  const fields = contactForm?.fields ?? [];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Contact Form:", data);
    toast.success(contactForm?.successMessage ?? "Đã gửi");
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>
      {hero && (
        <section className="relative h-[50vh] min-h-[400px]">
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
              <p className="text-xl text-white/80 max-w-2xl">{hero.subtitle}</p>
            </motion.div>
          </div>
        </section>
      )}

      <Breadcrumb items={[{ label: "Liên hệ" }]} />

      <section className={`py-12 ${theme.colors.bgPrimary}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {contactInfo && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-[#4b4b4b] p-8">
                  <h2 className="text-5xl md:text-7xl text-white mb-8">
                    {contactInfo.heading}
                  </h2>
                  <p className="text-xl text-white/70 mb-12">{contactInfo.description}</p>

                  <div className="space-y-8">
                    {(contactInfo.items ?? []).map((info, index) => {
                      const Icon = ICON_MAP[info.icon];
                      return (
                        <div key={index} className="flex gap-6">
                          <div className="w-12 h-12 bg-[#D4A017] flex items-center justify-center flex-shrink-0">
                            {Icon && <Icon className="w-6 h-6 text-[#111111]" />}
                          </div>
                          <div>
                            <h3 className="text-xl text-white mb-2">{info.title}</h3>
                            {(info.details ?? []).map((detail, i) => (
                              <p key={i} className="text-white/70">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {quickContact && (
                    <div className="mt-12 p-8 bg-[#2B2B2B]">
                      <h3 className="text-2xl text-white mb-4">{quickContact.heading}</h3>
                      <p className="text-white/70 mb-4">{quickContact.description}</p>
                      <a
                        href={quickContact.zalo?.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#0068FF] text-white px-6 py-3 hover:bg-[#0068FF]/90 transition-colors"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.875 1.395 5.45 3.566 7.208l-.437 3.274a.75.75 0 001.094.702l3.676-2.02c1.285.37 2.647.568 4.101.568 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm0 16.486c-1.36 0-2.66-.213-3.867-.611a.75.75 0 00-.547.038l-2.675 1.47.318-2.383a.75.75 0 00-.24-.662C3.47 15.22 2.5 13.325 2.5 11.243 2.5 6.977 6.753 3.5 12 3.5s9.5 3.477 9.5 7.743-4.253 7.743-9.5 7.743z" />
                        </svg>
                        {quickContact.zalo?.label}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {contactForm && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-[#2B2B2B] p-8">
                  <h2 className="text-3xl text-white mb-6">{contactForm.heading}</h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {fields.map((field) => {
                      const required = field.required;
                      const rules = required ? { required: "Required" } : {};
                      const inputClass =
                        "w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors";

                      return (
                        <div key={field.id}>
                          <label htmlFor={field.id} className="block text-white mb-2">
                            {field.label} {required && "*"}
                          </label>
                          {field.type === "textarea" ? (
                            <textarea
                              id={field.id}
                              {...register(field.id, rules)}
                              rows={field.rows ?? 4}
                              className={`${inputClass} resize-none`}
                              placeholder={field.placeholder}
                            />
                          ) : field.type === "select" ? (
                            <select
                              id={field.id}
                              {...register(field.id, rules)}
                              className={inputClass}
                            >
                              {(field.options ?? []).map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              id={field.id}
                              type={field.type ?? "text"}
                              {...register(field.id, rules)}
                              className={inputClass}
                              placeholder={field.placeholder}
                            />
                          )}
                          {errors[field.id] && (
                            <p className="text-red-500 mt-1 text-sm">
                              {String(errors[field.id].message)}
                            </p>
                          )}
                        </div>
                      );
                    })}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#D4A017] text-[#111111] px-8 py-4 hover:bg-[#D4A017]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
                          {contactForm.submitButton?.loadingLabel}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {contactForm.submitButton?.label}
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {map && (
        <section className="py-20 bg-[#2B2B2B]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-7xl text-white mb-4">{map.heading}</h2>
              <p className="text-xl text-white/70">{map.description}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] bg-[#111111] flex items-center justify-center"
            >
              <div className="text-center">
                <MapPin className="w-16 h-16 text-[#D4A017] mx-auto mb-4" />
                <h3 className="text-2xl text-white mb-2">Vị Trí Nhà Máy</h3>
                <p className="text-white/70 mb-4">{map.address}</p>
                {map.googleMapsLabel && (
                  <a
                    href={map.googleMapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#D4A017] text-[#111111] px-8 py-3 hover:bg-[#D4A017]/90 transition-colors"
                  >
                    {map.googleMapsLabel}
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {infoCards?.length > 0 && (
        <section className={`py-12 ${theme.colors.brand}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {infoCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[#2B2B2B] p-8 text-center"
                >
                  <h3 className="text-2xl text-[#D4A017] mb-4">{card.title}</h3>
                  <p className="text-white/70">{card.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
