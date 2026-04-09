"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      category: "GENERAL",
      questions: [
        {
          question: "What file formats do you accept?",
          answer: "We accept CAD files (.dwg, .dxf), PDF technical drawings, SketchUp files (.skp), 3D models (.stl, .3dm), and other common design formats. If you're unsure about your file format, please contact us and we'll assist you.",
        },
        {
          question: "What is your minimum order quantity?",
          answer: "We don't have a strict minimum order quantity. However, for cost-effectiveness, we recommend orders of at least 50-100 pieces. For smaller prototype runs or samples, please contact us to discuss pricing.",
        },
        {
          question: "How long does it take to receive a quote?",
          answer: "We typically provide detailed quotes within 24 hours of receiving your files and specifications. For complex or large projects, it may take up to 48 hours.",
        },
        {
          question: "Do you offer samples before full production?",
          answer: "Yes, we can produce samples for your approval before proceeding with full production. Sample costs are typically deducted from the final order if you proceed.",
        },
      ],
    },
    {
      category: "MATERIALS & PROCESSING",
      questions: [
        {
          question: "What materials can you process?",
          answer: "We work with MDF, plywood, chipboard, melamine board, solid wood, and acrylic. Material thickness ranges from 6mm to 40mm. We can also source specific materials upon request.",
        },
        {
          question: "What edge banding options are available?",
          answer: "We offer PVC, ABS, veneer, and acrylic edge banding in various colors and thicknesses (0.4mm - 3mm). We use PUR adhesive for superior bond strength and durability.",
        },
        {
          question: "Can you handle curved or 3D designs?",
          answer: "Yes, we specialize in MDF bending for curved furniture components and offer 5-axis CNC routing for complex 3D shapes and carvings.",
        },
        {
          question: "What is your maximum panel size?",
          answer: "Our CNC machines can process panels up to 3000mm x 2000mm. For larger pieces, we can create them in sections designed for seamless assembly.",
        },
      ],
    },
    {
      category: "PRICING & PAYMENT",
      questions: [
        {
          question: "How is pricing calculated?",
          answer: "Pricing is based on material costs, processing complexity, edge banding requirements, quantity, and delivery timeline. We provide detailed breakdowns in our quotes.",
        },
        {
          question: "Do you offer volume discounts?",
          answer: "Yes, we offer competitive pricing for high-volume orders and long-term partnerships. Regular customers also receive priority pricing.",
        },
        {
          question: "What are your payment terms?",
          answer: "For new customers, we typically require 50% deposit with the remaining 50% before delivery. Established partners may qualify for net-30 payment terms.",
        },
        {
          question: "Are there any hidden fees?",
          answer: "No, our quotes include all processing costs. Delivery/shipping is quoted separately. Any changes to specifications after quote approval may incur revision fees.",
        },
      ],
    },
    {
      category: "PRODUCTION & DELIVERY",
      questions: [
        {
          question: "What is the typical lead time?",
          answer: "Standard lead time is 7-14 days from order confirmation, depending on complexity and volume. Rush orders may be available for an additional fee.",
        },
        {
          question: "Can you expedite urgent orders?",
          answer: "Yes, we can often accommodate rush orders. Please specify your deadline when requesting a quote, and we'll let you know if it's feasible.",
        },
        {
          question: "How do you ensure quality?",
          answer: "We have a multi-stage quality control process including material inspection, in-process monitoring, and final inspection before packaging. Each order includes quality documentation.",
        },
        {
          question: "Do you provide delivery services?",
          answer: "We can arrange delivery within Vietnam. For international shipments, we work with trusted logistics partners and can provide FOB or CIF terms.",
        },
      ],
    },
    {
      category: "TECHNICAL SUPPORT",
      questions: [
        {
          question: "Can you help optimize my designs for manufacturing?",
          answer: "Absolutely! Our technical team reviews all designs and provides recommendations to optimize for CNC processing, reduce waste, and improve manufacturability.",
        },
        {
          question: "What if my design files have errors?",
          answer: "We'll identify any issues during our file review process and contact you with suggestions for corrections before production begins.",
        },
        {
          question: "Do you provide technical drawings or CAM files?",
          answer: "Yes, we can provide technical drawings for your approval. CAM files are typically proprietary but we can discuss specific requirements.",
        },
        {
          question: "Can you assist with assembly instructions?",
          answer: "For complex projects, we can provide basic assembly guidelines or recommendations for hardware and joining methods.",
        },
      ],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
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
            <h1 className="text-6xl md:text-8xl text-white mb-4">FAQ</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Frequently asked questions about our CNC processing services
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-4xl mx-auto px-4">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-5xl text-[#D4A017] mb-8">{category.category}</h2>
              
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 10 + faqIndex;
                  const isOpen = openIndex === globalIndex;
                  
                  return (
                    <div
                      key={faqIndex}
                      className="bg-[#2B2B2B] overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-[#2B2B2B]/80 transition-colors"
                      >
                        <h3 className="text-xl text-white pr-8">{faq.question}</h3>
                        <ChevronDown
                          className={`w-6 h-6 text-[#D4A017] flex-shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? "max-h-96" : "max-h-0"
                        }`}
                      >
                        <div className="px-6 pb-6">
                          <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-[#2B2B2B]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl text-white mb-6">
              STILL HAVE QUESTIONS?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Our team is here to help. Contact us for personalized assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block bg-[#D4A017] text-[#111111] px-12 py-5 hover:bg-[#D4A017]/90 transition-colors"
              >
                CONTACT US
              </a>
              <a
                href="tel:+84123456789"
                className="inline-block border-2 border-[#D4A017] text-[#D4A017] px-12 py-5 hover:bg-[#D4A017] hover:text-[#111111] transition-colors"
              >
                CALL NOW
              </a>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-[#111111] p-6">
                <h3 className="text-xl text-[#D4A017] mb-2">PHONE</h3>
                <p className="text-white/70">+84 123 456 789</p>
                <p className="text-white/50 text-sm mt-1">Mon-Sat: 8AM - 6PM</p>
              </div>
              <div className="bg-[#111111] p-6">
                <h3 className="text-xl text-[#D4A017] mb-2">EMAIL</h3>
                <p className="text-white/70">info@mocnghiacnc.com</p>
                <p className="text-white/50 text-sm mt-1">Response within 24h</p>
              </div>
              <div className="bg-[#111111] p-6">
                <h3 className="text-xl text-[#D4A017] mb-2">ZALO</h3>
                <p className="text-white/70">Message us on Zalo</p>
                <p className="text-white/50 text-sm mt-1">Quick response</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
