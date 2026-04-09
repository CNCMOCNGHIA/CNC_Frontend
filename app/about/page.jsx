"use client";

import { motion } from "motion/react";
import { Award, Users, Target, Factory } from "lucide-react";

export default function About() {
  const machinery = [
    {
      name: "CNC Router Machines",
      specs: "5-axis precision cutting, working area 3000x2000mm",
      quantity: "8 units",
      image: "https://images.unsplash.com/photo-1764115424769-ebdd2683d5a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDTkMlMjBtYWNoaW5lJTIwaW5kdXN0cmlhbCUyMGZhY3Rvcnl8ZW58MXx8fHwxNzczNjQ1MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "PUR Edge Banding Machines",
      specs: "Automatic edge banding with pre-milling and corner rounding",
      quantity: "4 units",
      image: "https://images.unsplash.com/photo-1642381071059-7a8c84c197ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGdlJTIwYmFuZGluZyUyMG1hY2hpbmV8ZW58MXx8fHwxNzczNjQ1MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Panel Saw Systems",
      specs: "Vertical and horizontal panel cutting with digital positioning",
      quantity: "6 units",
      image: "https://images.unsplash.com/photo-1693948568453-a3564f179a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDTkMlMjBjdXR0aW5nJTIwd29vZCUyMHBhbmVsfGVufDF8fHx8MTc3MzY0NTMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Multi-Boring Machines",
      specs: "32mm system drilling with handle routing capability",
      quantity: "5 units",
      image: "https://images.unsplash.com/photo-1759159091728-e2c87b9d9315?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVjaXNpb24lMjBtYWNoaW5lcnklMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc3MzY0NTMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const values = [
    {
      icon: Award,
      title: "QUALITY",
      description: "ISO 9001 certified processes ensuring consistent quality in every project",
    },
    {
      icon: Users,
      title: "PARTNERSHIP",
      description: "Building long-term B2B relationships based on trust and reliability",
    },
    {
      icon: Target,
      title: "PRECISION",
      description: "Advanced CNC technology for accurate and repeatable results",
    },
    {
      icon: Factory,
      title: "CAPACITY",
      description: "5,000 sqm facility capable of handling large-scale production",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1769430838012-8e1270d41f46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwZnVybml0dXJlJTIwbWFudWZhY3R1cmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MzY0NTMzNHww&ixlib=rb-4.1.0&q=80&w=1080')`,
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
            <h1 className="text-6xl md:text-8xl text-white mb-4">ABOUT US</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Leading CNC furniture processing factory with 15+ years of expertise in precision manufacturing
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl text-white mb-6">OUR STORY</h2>
              <div className="space-y-4 text-white/80">
                <p>
                  Established in 2010, Moc Nghia CNC Furniture Processing Factory has grown from a small workshop to a leading B2B partner in the furniture manufacturing industry.
                </p>
                <p>
                  We specialize in precision CNC processing, edge banding, and custom furniture production, serving manufacturers across Vietnam and Southeast Asia.
                </p>
                <p>
                  Our 5,000 square meter facility houses state-of-the-art CNC machinery and a team of skilled technicians dedicated to delivering exceptional quality and service.
                </p>
                <p>
                  With ISO 9001 certification and a commitment to continuous improvement, we ensure every project meets the highest standards of precision and craftsmanship.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px]"
            >
              <img
                src="https://images.unsplash.com/photo-1615990860014-99e51245218c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbmR1c3RyaWFsJTIwd29ya3Nob3B8ZW58MXx8fHwxNzczNjQ1MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Factory floor"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-[#2B2B2B]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl text-white mb-4">OUR VALUES</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              The principles that guide our business and relationships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#111111] p-8 hover:bg-[#D4A017] hover:text-[#111111] transition-colors group"
              >
                <value.icon className="w-12 h-12 mb-6 text-[#D4A017] group-hover:text-[#111111]" />
                <h3 className="text-2xl text-white group-hover:text-[#111111] mb-3">{value.title}</h3>
                <p className="text-white/70 group-hover:text-[#111111]/80">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Machinery & Equipment */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl text-white mb-4">OUR MACHINERY</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Advanced equipment ensuring precision and efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {machinery.map((machine, index) => (
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
                src="https://images.unsplash.com/photo-1764185800646-f75f7e16e465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbWFudWZhY3R1cmluZyUyMGZsb29yfGVufDF8fHx8MTc3MzY0NTMzNXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Manufacturing floor"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl text-white mb-6">OUR FACILITY</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-[#D4A017] pl-6">
                  <h3 className="text-2xl text-white mb-2">5,000 sqm Production Area</h3>
                  <p className="text-white/70">
                    Spacious facility designed for efficient workflow and large-scale production
                  </p>
                </div>
                <div className="border-l-4 border-[#D4A017] pl-6">
                  <h3 className="text-2xl text-white mb-2">Climate-Controlled Environment</h3>
                  <p className="text-white/70">
                    Maintaining optimal conditions for wood processing and quality assurance
                  </p>
                </div>
                <div className="border-l-4 border-[#D4A017] pl-6">
                  <h3 className="text-2xl text-white mb-2">Advanced Quality Control</h3>
                  <p className="text-white/70">
                    Dedicated QC stations with precision measuring equipment
                  </p>
                </div>
                <div className="border-l-4 border-[#D4A017] pl-6">
                  <h3 className="text-2xl text-white mb-2">Safe & Organized</h3>
                  <p className="text-white/70">
                    ISO certified safety protocols and 5S workplace management
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
