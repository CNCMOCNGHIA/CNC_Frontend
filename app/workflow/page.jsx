"use client";

import { motion } from "motion/react";
import { Upload, FileSearch, Settings, Package, Truck, CheckCircle } from "lucide-react";
import { theme } from "@/constants/theme";

export default function Workflow() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "SUBMIT FILES",
      description: "Upload your CAD drawings, PDFs, or SketchUp files through our online quote form. Include material specifications and quantity requirements.",
      details: [
        "Supported formats: DWG, DXF, PDF, SKP, STL",
        "Include material thickness and type",
        "Specify edge banding requirements",
        "Add any special instructions",
      ],
    },
    {
      number: "02",
      icon: FileSearch,
      title: "FILE REVIEW",
      description: "Our technical team reviews your files for manufacturability and optimizes the design for CNC processing efficiency.",
      details: [
        "Technical feasibility analysis",
        "Material optimization suggestions",
        "Nesting layout planning",
        "Cost estimation preparation",
      ],
    },
    {
      number: "03",
      icon: CheckCircle,
      title: "QUOTATION",
      description: "Receive a detailed quote within 24 hours, including pricing breakdown, lead time, and any technical recommendations.",
      details: [
        "Transparent pricing breakdown",
        "Estimated production timeline",
        "Material and labor costs",
        "Technical recommendations",
      ],
    },
    {
      number: "04",
      icon: Settings,
      title: "PRODUCTION",
      description: "Once approved, we prepare CAM files and begin CNC processing using our advanced machinery and quality control systems.",
      details: [
        "CAM programming and optimization",
        "Material preparation and cutting",
        "CNC routing and processing",
        "Edge banding and finishing",
        "Quality inspection at each stage",
      ],
    },
    {
      number: "05",
      icon: Package,
      title: "QUALITY CHECK",
      description: "Every piece undergoes rigorous quality control inspection to ensure it meets specifications and industry standards.",
      details: [
        "Dimensional accuracy verification",
        "Surface finish inspection",
        "Edge banding quality check",
        "Assembly fit testing",
        "Final documentation",
      ],
    },
    {
      number: "06",
      icon: Truck,
      title: "DELIVERY",
      description: "Careful packaging and delivery coordination to ensure your products arrive in perfect condition, ready for assembly.",
      details: [
        "Professional packaging",
        "Protective wrapping and crating",
        "Delivery scheduling",
        "Documentation and certificates",
        "After-delivery support",
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
            <h1 className={`${theme.fonts.heading} ${theme.text.heroTitle} text-white mb-4`}>OUR WORKFLOW</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              From file submission to delivery - a streamlined process ensuring quality and efficiency
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-5xl mx-auto px-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative mb-16 last:mb-0"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-24 w-0.5 h-full bg-[#D4A017]/30 hidden md:block" />
              )}

              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Icon Section */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 bg-[#D4A017] flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-[#111111]" />
                    </div>
                    <div className="absolute -top-4 -right-4 text-6xl text-[#D4A017]/20 font-body font-bold">
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-grow bg-[#2B2B2B] p-8">
                  <h2 className="text-4xl text-white mb-4">{step.title}</h2>
                  <p className="text-xl text-white/80 mb-6">{step.description}</p>
                  
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-[#D4A017] mt-2 flex-shrink-0" />
                        <span className="text-white/70">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline Summary */}
      <section className="py-20 bg-[#2B2B2B]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl text-white mb-4">TYPICAL TIMELINE</h2>
            <p className="text-xl text-white/70">
              Average project duration from quote to delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { phase: "Quote Response", time: "24 hours" },
              { phase: "Production Setup", time: "2-3 days" },
              { phase: "Manufacturing", time: "7-14 days" },
              { phase: "QC & Delivery", time: "2-3 days" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#111111] p-8 text-center"
              >
                <div className="text-5xl text-[#D4A017] mb-3">{item.time}</div>
                <div className="text-white/70 uppercase tracking-wider">{item.phase}</div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-white/60">
              * Timeline may vary based on project complexity, material availability, and order volume
            </p>
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl text-white mb-6">QUALITY ASSURANCE</h2>
              <p className="text-xl text-white/80 mb-8">
                Our multi-stage quality control process ensures every piece meets exact specifications.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Material Inspection",
                    description: "Verify material quality, thickness, and specifications before processing",
                  },
                  {
                    title: "In-Process Checks",
                    description: "Monitor dimensions and quality during CNC operations",
                  },
                  {
                    title: "Final Inspection",
                    description: "Comprehensive review of dimensions, finish, and functionality",
                  },
                  {
                    title: "Documentation",
                    description: "Complete quality reports and certificates for traceability",
                  },
                ].map((item, index) => (
                  <div key={index} className="border-l-4 border-[#D4A017] pl-6">
                    <h3 className="text-2xl text-white mb-2">{item.title}</h3>
                    <p className="text-white/70">{item.description}</p>
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
                src="https://images.unsplash.com/photo-1759159091728-e2c87b9d9315?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVjaXNpb24lMjBtYWNoaW5lcnklMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc3MzY0NTMzNHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Quality inspection"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
