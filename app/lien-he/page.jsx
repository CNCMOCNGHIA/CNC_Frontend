"use client";

import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { theme } from "@/constants/theme";

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Contact Form:", data);
    toast.success("Message sent successfully! We'll get back to you within 24 hours.");
    
    reset();
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "FACTORY ADDRESS",
      details: [
        "123 Industrial Zone",
        "Binh Duong Province",
        "Vietnam",
      ],
    },
    {
      icon: Phone,
      title: "PHONE",
      details: [
        "+84 123 456 789",
        "+84 987 654 321",
      ],
    },
    {
      icon: Mail,
      title: "EMAIL",
      details: [
        "info@mocnghiacnc.com",
        "sales@mocnghiacnc.com",
      ],
    },
    {
      icon: Clock,
      title: "WORKING HOURS",
      details: [
        "Monday - Friday: 8:00 AM - 6:00 PM",
        "Saturday: 8:00 AM - 12:00 PM",
        "Sunday: Closed",
      ],
    },
  ];

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1764185800646-f75f7e16e465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbWFudWZhY3R1cmluZyUyMGZsb29yfGVufDF8fHx8MTc3MzY0NTMzNXww&ixlib=rb-4.1.0&q=80&w=1080')`,
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
            <h1 className={`${theme.fonts.heading} ${theme.text.heroTitle} text-white mb-4`}>CONTACT US</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Get in touch with our team for inquiries, quotes, or partnership opportunities
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl text-white mb-8">GET IN TOUCH</h2>
              <p className="text-xl text-white/70 mb-12">
                Visit our factory, call us, or send a message. We're here to help with your CNC processing needs.
              </p>

              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="w-12 h-12 bg-[#D4A017] flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-[#111111]" />
                    </div>
                    <div>
                      <h3 className="text-xl text-white mb-2">{info.title}</h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-white/70">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social/Zalo */}
              <div className="mt-12 p-8 bg-[#2B2B2B]">
                <h3 className="text-2xl text-white mb-4">QUICK CONTACT</h3>
                <p className="text-white/70 mb-4">
                  For immediate assistance, message us on Zalo
                </p>
                <a
                  href="https://zalo.me/84123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0068FF] text-white px-6 py-3 hover:bg-[#0068FF]/90 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.875 1.395 5.45 3.566 7.208l-.437 3.274a.75.75 0 001.094.702l3.676-2.02c1.285.37 2.647.568 4.101.568 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm0 16.486c-1.36 0-2.66-.213-3.867-.611a.75.75 0 00-.547.038l-2.675 1.47.318-2.383a.75.75 0 00-.24-.662C3.47 15.22 2.5 13.325 2.5 11.243 2.5 6.977 6.753 3.5 12 3.5s9.5 3.477 9.5 7.743-4.253 7.743-9.5 7.743z"/>
                  </svg>
                  CHAT ON ZALO
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#2B2B2B] p-8">
                <h2 className="text-3xl text-white mb-6">SEND US A MESSAGE</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-white mb-2">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="text-red-500 mt-1 text-sm">{String(errors.name.message)}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-white mb-2">
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register("email", { 
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                        className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 mt-1 text-sm">{String(errors.email.message)}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-white mb-2">
                        Phone *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        {...register("phone", { required: "Phone is required" })}
                        className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                        placeholder="+84 123 456 789"
                      />
                      {errors.phone && (
                        <p className="text-red-500 mt-1 text-sm">{String(errors.phone.message)}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-white mb-2">
                      Company Name
                    </label>
                    <input
                      id="company"
                      type="text"
                      {...register("company")}
                      className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                      placeholder="Your company"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-white mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      {...register("subject", { required: "Subject is required" })}
                      className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="quote">Request Quote</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="technical">Technical Question</option>
                      <option value="visit">Factory Visit</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="text-red-500 mt-1 text-sm">{String(errors.subject.message)}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-white mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      {...register("message", { required: "Message is required" })}
                      rows={6}
                      className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your project or inquiry..."
                    />
                    {errors.message && (
                      <p className="text-red-500 mt-1 text-sm">{String(errors.message.message)}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#D4A017] text-[#111111] px-8 py-4 hover:bg-[#D4A017]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
                        SENDING...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        SEND MESSAGE
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-20 bg-[#2B2B2B]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl text-white mb-4">FIND US</h2>
            <p className="text-xl text-white/70">
              Located in Binh Duong Industrial Zone
            </p>
          </div>

          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative h-[500px] bg-[#111111] flex items-center justify-center"
          >
            <div className="text-center">
              <MapPin className="w-16 h-16 text-[#D4A017] mx-auto mb-4" />
              <h3 className="text-2xl text-white mb-2">FACTORY LOCATION</h3>
              <p className="text-white/70 mb-4">123 Industrial Zone, Binh Duong Province, Vietnam</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#D4A017] text-[#111111] px-8 py-3 hover:bg-[#D4A017]/90 transition-colors"
              >
                OPEN IN GOOGLE MAPS
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              viewport={{ once: true }}
              className="bg-[#2B2B2B] p-8 text-center"
            >
              <h3 className="text-2xl text-[#D4A017] mb-4">RESPONSE TIME</h3>
              <p className="text-white/70">
                We typically respond to all inquiries within 24 hours during business days
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-[#2B2B2B] p-8 text-center"
            >
              <h3 className="text-2xl text-[#D4A017] mb-4">FACTORY VISITS</h3>
              <p className="text-white/70">
                Schedule a visit to see our facilities and machinery in action. Contact us to arrange
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[#2B2B2B] p-8 text-center"
            >
              <h3 className="text-2xl text-[#D4A017] mb-4">TECHNICAL SUPPORT</h3>
              <p className="text-white/70">
                Our engineering team is available to discuss technical requirements and specifications
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
