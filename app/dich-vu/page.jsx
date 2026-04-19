"use client";

import { motion } from "motion/react";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { theme } from "@/constants/theme";

export default function Services() {
  const services = [
    {
      title: "CNC CUTTING",
      description: "High-precision CNC routing and cutting for wood panels, MDF, plywood, and other furniture materials. Our 5-axis CNC machines deliver accuracy within 0.1mm tolerance.",
      image: "https://images.unsplash.com/photo-1693948568453-a3564f179a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDTkMlMjBjdXR0aW5nJTIwd29vZCUyMHBhbmVsfGVufDF8fHx8MTc3MzY0NTMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
      features: [
        "5-axis CNC routing capability",
        "Working area up to 3000x2000mm",
        "Complex shape cutting and engraving",
        "Nested cutting optimization",
        "CAD/CAM file support (DXF, DWG, SKP)",
        "0.1mm precision tolerance",
      ],
    },
    {
      title: "PUR EDGE BANDING",
      description: "Professional edge banding services using PUR (Polyurethane Reactive) adhesive for superior bond strength and durability. Ideal for high-quality furniture production.",
      image: "https://images.unsplash.com/photo-1642381071059-7a8c84c197ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGdlJTIwYmFuZGluZyUyMG1hY2hpbmV8ZW58MXx8fHwxNzczNjQ1MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: [
        "PUR hot-melt adhesive technology",
        "Edge thickness 0.4mm - 3mm",
        "Pre-milling and corner rounding",
        "Scraping and buffing finish",
        "Heat and moisture resistant bonding",
        "Suitable for all edge materials (PVC, ABS, veneer)",
      ],
    },
    {
      title: "MDF BENDING",
      description: "Specialized MDF and plywood bending services for curved furniture components. Our press forming technology creates smooth, consistent curves without surface cracking.",
      image: "https://images.unsplash.com/photo-1759159091728-e2c87b9d9315?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVjaXNpb24lMjBtYWNoaW5lcnklMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc3MzY0NTMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
      features: [
        "Curved panel production",
        "Radius forming from 50mm",
        "MDF and plywood materials",
        "Custom curve specifications",
        "Smooth surface finish",
        "Suitable for modern furniture designs",
      ],
    },
    {
      title: "DRILLING & HANDLE ROUTING",
      description: "Precision drilling and routing for cabinet hardware, handles, and hinges. Our multi-boring machines ensure perfect alignment for easy assembly.",
      image: "https://images.unsplash.com/photo-1764115424769-ebdd2683d5a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDTkMlMjBtYWNoaW5lJTIwaW5kdXN0cmlhbCUyMGZhY3Rvcnl8ZW58MXx8fHwxNzczNjQ1MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: [
        "32mm system drilling",
        "Handle routing and profiling",
        "Hinge boring (cup and mounting holes)",
        "Multi-spindle boring machines",
        "Programmable drilling patterns",
        "High-speed production capability",
      ],
    },
  ];

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>
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
            <h1 className={`${theme.fonts.heading} ${theme.text.heroTitle} text-white mb-4`}>OUR SERVICES</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Comprehensive CNC processing solutions for furniture manufacturers
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Detail Sections */}
      {services.map((service, index) => (
        <section
          key={index}
          className={index % 2 === 0 ? "py-20 bg-[#111111]" : "py-20 bg-[#2B2B2B]"}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={index % 2 === 1 ? "lg:order-2" : ""}
              >
                <h2 className="text-5xl md:text-7xl text-white mb-6">{service.title}</h2>
                <p className="text-xl text-white/80 mb-8">{service.description}</p>

                <div className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4A017] flex-shrink-0 mt-1" />
                      <span className="text-white/70">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/gia-cong"
                  className="inline-flex items-center gap-2 bg-[#D4A017] text-[#111111] px-8 py-4 hover:bg-[#D4A017]/90 transition-colors group"
                >
                  REQUEST QUOTE
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
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
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* Additional Services */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl text-white mb-4">ADDITIONAL SERVICES</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Complete solutions for your furniture manufacturing needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Panel Sizing",
                description: "Precise panel cutting to your exact specifications with minimal waste",
              },
              {
                title: "Surface Finishing",
                description: "Sanding, laminating, and surface treatment services",
              },
              {
                title: "Custom Profiling",
                description: "Edge profiling and decorative routing for unique designs",
              },
              {
                title: "Assembly Services",
                description: "Partial or full assembly of furniture components",
              },
              {
                title: "Packaging",
                description: "Professional packaging for safe transportation",
              },
              {
                title: "Consulting",
                description: "Technical consultation for design optimization and manufacturing efficiency",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#2B2B2B] p-8 hover:bg-[#D4A017] hover:text-[#111111] transition-colors group"
              >
                <h3 className="text-2xl text-white group-hover:text-[#111111] mb-3">{item.title}</h3>
                <p className="text-white/70 group-hover:text-[#111111]/80">{item.description}</p>
              </motion.div>
            ))}
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
              NEED A CUSTOM SOLUTION?
            </h2>
            <p className="text-xl text-[#111111]/80 mb-8">
              Contact us to discuss your specific requirements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/gia-cong"
                className="inline-flex items-center justify-center gap-2 bg-[#111111] text-[#D4A017] px-8 py-4 hover:bg-[#111111]/90 transition-colors"
              >
                SEND FILES & GET QUOTE
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#111111] text-[#111111] px-8 py-4 hover:bg-[#111111] hover:text-[#D4A017] transition-colors"
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
