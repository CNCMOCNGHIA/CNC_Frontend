"use client";

import { motion } from "motion/react";
import { Building2, Award, Handshake } from "lucide-react";
import Link from "next/link";
import { theme } from "@/constants/theme";
import { Breadcrumb } from "@/components/breadcrumb";

export default function Partners() {
  const partners = [
    {
      name: "Premium Furniture Co.",
      type: "Cabinet Manufacturer",
      location: "Ho Chi Minh City",
      partnership: "Since 2015",
      description: "Long-term partnership for high-end kitchen cabinet production",
    },
    {
      name: "Modern Living Interiors",
      type: "Interior Design Firm",
      location: "Hanoi",
      partnership: "Since 2017",
      description: "Custom furniture components for residential and commercial projects",
    },
    {
      name: "Office Solutions Pro",
      type: "Commercial Furniture",
      location: "Da Nang",
      partnership: "Since 2018",
      description: "Office furniture manufacturing and workspace solutions",
    },
    {
      name: "Viet Crafts Export",
      type: "Furniture Exporter",
      location: "Binh Duong",
      partnership: "Since 2016",
      description: "CNC processing for export-quality furniture components",
    },
    {
      name: "Eco Wood Design",
      type: "Sustainable Furniture",
      location: "Ho Chi Minh City",
      partnership: "Since 2019",
      description: "Environmentally conscious furniture production partnership",
    },
    {
      name: "Luxury Living Spaces",
      type: "High-End Residential",
      location: "Hanoi",
      partnership: "Since 2020",
      description: "Bespoke furniture for luxury residential developments",
    },
  ];

  const benefits = [
    {
      icon: Award,
      title: "PRIORITY SERVICE",
      description: "Long-term partners receive priority scheduling and dedicated support",
    },
    {
      icon: Handshake,
      title: "VOLUME DISCOUNTS",
      description: "Competitive pricing for regular and high-volume orders",
    },
    {
      icon: Building2,
      title: "TECHNICAL COLLABORATION",
      description: "Work closely with our team to optimize designs and manufacturing",
    },
  ];

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1615990860014-99e51245218c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbmR1c3RyaWFsJTIwd29ya3Nob3B8ZW58MXx8fHwxNzczNjQ1MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080')`,
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
            <h1 className={`${theme.fonts.heading} ${theme.text.heroTitle} text-white mb-4`}>OUR PARTNERS</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Building long-term relationships with furniture manufacturers across Vietnam
            </p>
          </motion.div>
        </div>
      </section>

      <Breadcrumb items={[{ label: "Đối tác" }]} />

      {/* Partnership Benefits */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl text-white mb-4">PARTNERSHIP BENEFITS</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Why leading manufacturers choose to partner with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#2B2B2B] p-8 text-center hover:bg-[#D4A017] hover:text-[#111111] transition-colors group"
              >
                <benefit.icon className="w-16 h-16 mx-auto mb-6 text-[#D4A017] group-hover:text-[#111111]" />
                <h3 className="text-2xl text-white group-hover:text-[#111111] mb-3">{benefit.title}</h3>
                <p className="text-white/70 group-hover:text-[#111111]/80">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20 bg-[#2B2B2B]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl text-white mb-4">TRUSTED BY</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Proud to work with these industry leaders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#111111] p-8 hover:border-l-4 hover:border-[#D4A017] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl text-white">{partner.name}</h3>
                  <span className="text-[#D4A017] text-sm whitespace-nowrap">{partner.partnership}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-white/70">{partner.type}</p>
                  <p className="text-white/50 text-sm">{partner.location}</p>
                </div>
                
                <p className="text-white/60">{partner.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Statistics */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "100+", label: "Active Partners" },
              { number: "95%", label: "Partner Retention" },
              { number: "500+", label: "Projects Completed" },
              { number: "15+", label: "Years Experience" },
            ].map((stat, index) => (
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

      {/* Partnership Requirements */}
      <section className="py-20 bg-[#2B2B2B]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl text-white mb-6">BECOME A PARTNER</h2>
              <p className="text-xl text-white/80 mb-8">
                We're always looking for reliable, quality-focused manufacturers to work with.
              </p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-[#D4A017] pl-6">
                  <h3 className="text-2xl text-white mb-2">Regular Volume</h3>
                  <p className="text-white/70">
                    Consistent monthly or quarterly orders to establish a long-term relationship
                  </p>
                </div>
                <div className="border-l-4 border-[#D4A017] pl-6">
                  <h3 className="text-2xl text-white mb-2">Quality Standards</h3>
                  <p className="text-white/70">
                    Commitment to high-quality furniture production and industry standards
                  </p>
                </div>
                <div className="border-l-4 border-[#D4A017] pl-6">
                  <h3 className="text-2xl text-white mb-2">Professional Communication</h3>
                  <p className="text-white/70">
                    Clear technical specifications and timely communication
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px]"
            >
              <img
                src="https://images.unsplash.com/photo-1764185800646-f75f7e16e465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbWFudWZhY3R1cmluZyUyMGZsb29yfGVufDF8fHx8MTc3MzY0NTMzNXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Partnership"
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
              INTERESTED IN PARTNERING?
            </h2>
            <p className="text-xl text-[#111111]/80 mb-8">
              Let's discuss how we can support your manufacturing needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/gia-cong"
                className="inline-block bg-[#111111] text-[#D4A017] px-12 py-5 hover:bg-[#111111]/90 transition-colors"
              >
                REQUEST QUOTE
              </Link>
              <Link
                href="/contact"
                className="inline-block border-2 border-[#111111] text-[#111111] px-12 py-5 hover:bg-[#111111] hover:text-[#D4A017] transition-colors"
              >
                CONTACT US
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
