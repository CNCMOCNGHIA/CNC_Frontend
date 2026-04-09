"use client";

import { motion } from "motion/react";
import { useState } from "react";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "ALL PRODUCTS" },
    { id: "cabinets", label: "CABINETS" },
    { id: "furniture", label: "FURNITURE" },
    { id: "panels", label: "PANELS" },
    { id: "custom", label: "CUSTOM PARTS" },
  ];

  const products = [
    {
      id: 1,
      category: "cabinets",
      name: "Kitchen Cabinet Components",
      description: "Precision-cut cabinet sides, shelves, and backs with edge banding",
      image: "https://images.unsplash.com/photo-1551907234-fb773fb08a2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXR1cmUlMjBkZXNpZ24lMjBtaW5pbWFsfGVufDF8fHx8MTc3MzY0NTMzN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      specs: ["18mm MDF/Plywood", "PUR edge banding", "Pre-drilled for hinges"],
    },
    {
      id: 2,
      category: "furniture",
      name: "Office Desk Components",
      description: "Modern desk tops and side panels with cable management routing",
      image: "https://images.unsplash.com/photo-1615990860014-99e51245218c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbmR1c3RyaWFsJTIwd29ya3Nob3B8ZW58MXx8fHwxNzczNjQ1MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      specs: ["25mm melamine board", "Custom cable cutouts", "Smooth edges"],
    },
    {
      id: 3,
      category: "panels",
      name: "Decorative Wall Panels",
      description: "3D carved MDF panels for interior decoration",
      image: "https://images.unsplash.com/photo-1693948568453-a3564f179a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDTkMlMjBjdXR0aW5nJTIwd29vZCUyMHBhbmVsfGVufDF8fHx8MTc3MzY0NTMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
      specs: ["CNC 3D carving", "Custom patterns", "Paint-ready finish"],
    },
    {
      id: 4,
      category: "cabinets",
      name: "Wardrobe Internals",
      description: "Shelving systems and drawer components for wardrobes",
      image: "https://images.unsplash.com/photo-1764115424769-ebdd2683d5a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDTkMlMjBtYWNoaW5lJTIwaW5kdXN0cmlhbCUyMGZhY3Rvcnl8ZW58MXx8fHwxNzczNjQ1MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      specs: ["16mm chipboard", "Shelf pin holes", "Drawer slides routing"],
    },
    {
      id: 5,
      category: "furniture",
      name: "TV Stand Components",
      description: "Modern entertainment center parts with integrated storage",
      image: "https://images.unsplash.com/photo-1769430838012-8e1270d41f46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwZnVybml0dXJlJTIwbWFudWZhY3R1cmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MzY0NTMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
      specs: ["18mm MDF", "Cable management", "Adjustable shelving"],
    },
    {
      id: 6,
      category: "custom",
      name: "Custom Curved Panels",
      description: "Bent MDF panels for unique furniture designs",
      image: "https://images.unsplash.com/photo-1759159091728-e2c87b9d9315?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVjaXNpb24lMjBtYWNoaW5lcnklMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc3MzY0NTMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
      specs: ["MDF bending", "Custom radius", "Edge banded"],
    },
    {
      id: 7,
      category: "panels",
      name: "Perforated Acoustic Panels",
      description: "Sound-absorbing panels with precision hole patterns",
      image: "https://images.unsplash.com/photo-1642381071059-7a8c84c197ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGdlJTIwYmFuZGluZyUyMG1hY2hpbmV8ZW58MXx8fHwxNzczNjQ1MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      specs: ["Precision drilling", "Custom hole patterns", "Acoustic backing"],
    },
    {
      id: 8,
      category: "custom",
      name: "Signage & Display Pieces",
      description: "Custom-cut letters, logos, and display components",
      image: "https://images.unsplash.com/photo-1689236673934-66f8e9d9279b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDTkMlMjByb3V0ZXIlMjBmdXJuaXR1cmV8ZW58MXx8fHwxNzczNjQ1MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      specs: ["Various materials", "Intricate cutting", "Custom designs"],
    },
  ];

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1551907234-fb773fb08a2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXR1cmUlMjBkZXNpZ24lMjBtaW5pbWFsfGVufDF8fHx8MTc3MzY0NTMzN3ww&ixlib=rb-4.1.0&q=80&w=1080')`,
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
            <h1 className="text-6xl md:text-8xl text-white mb-4">PRODUCTS & SAMPLES</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Explore our portfolio of precision-manufactured furniture components
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-[#2B2B2B] sticky top-[120px] z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-8 py-3 transition-colors ${
                  selectedCategory === category.id
                    ? "bg-[#D4A017] text-[#111111]"
                    : "bg-[#111111] text-white hover:bg-[#D4A017] hover:text-[#111111]"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#2B2B2B] overflow-hidden group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-60" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl text-white mb-3">{product.name}</h3>
                  <p className="text-white/70 mb-4">{product.description}</p>
                  
                  <div className="space-y-2">
                    {product.specs.map((spec, specIndex) => (
                      <div key={specIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#D4A017]" />
                        <span className="text-sm text-white/60">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 bg-[#2B2B2B]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl text-white mb-4">MANUFACTURING CAPABILITIES</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              What we can produce for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Material Range",
                items: ["MDF", "Plywood", "Chipboard", "Melamine", "Solid Wood", "Acrylic"],
              },
              {
                title: "Edge Banding",
                items: ["PVC", "ABS", "Veneer", "Acrylic", "0.4mm - 3mm", "All colors"],
              },
              {
                title: "Panel Sizes",
                items: ["Up to 3000mm", "Up to 2000mm", "Thickness 6-40mm", "Custom sizes"],
              },
              {
                title: "Finishing",
                items: ["Sanding", "Laminating", "Painting prep", "Assembly ready"],
              },
            ].map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#111111] p-8"
              >
                <h3 className="text-2xl text-[#D4A017] mb-4">{capability.title}</h3>
                <ul className="space-y-2">
                  {capability.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#D4A017] mt-2 flex-shrink-0" />
                      <span className="text-white/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl text-white mb-6">
              DON'T SEE WHAT YOU NEED?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              We specialize in custom projects. Send us your designs and we'll make it happen.
            </p>
            <a
              href="/quote"
              className="inline-block bg-[#D4A017] text-[#111111] px-12 py-5 hover:bg-[#D4A017]/90 transition-colors"
            >
              REQUEST CUSTOM QUOTE
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
