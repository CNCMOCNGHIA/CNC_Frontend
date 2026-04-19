"use client";

import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { theme } from "@/constants/theme";

export default function Quote() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate file upload and form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Quote Request:", { ...data, files });
    toast.success("Quote request submitted successfully! We'll contact you within 24 hours.");
    
    reset();
    setFiles([]);
    setIsSubmitting(false);
  };

  const acceptedFormats = [
    { ext: "CAD", desc: "AutoCAD files (.dwg, .dxf)" },
    { ext: "PDF", desc: "PDF drawings" },
    { ext: "SKP", desc: "SketchUp files" },
    { ext: "3DM", desc: "Rhino 3D files" },
    { ext: "STL", desc: "3D model files" },
  ];

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1689236673934-66f8e9d9279b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDTkMlMjByb3V0ZXIlMjBmdXJuaXR1cmV8ZW58MXx8fHwxNzczNjQ1MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080')`,
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
            <h1 className={`${theme.fonts.heading} ${theme.text.heroTitle} text-white mb-4`}>REQUEST QUOTE</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Upload your CAD files and receive a detailed quote within 24 hours
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-4xl mx-auto px-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#2B2B2B] p-8"
            >
              <h2 className="text-3xl text-white mb-6">CONTACT INFORMATION</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <p className="text-red-500 mt-1">{String(errors.name.message)}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-white mb-2">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register("phone", { required: "Phone is required" })}
                    className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                    placeholder="+84 123 456 789"
                  />
                  {errors.phone && (
                    <p className="text-red-500 mt-1">{String(errors.phone.message)}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-white mb-2">
                    Email Address *
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
                    <p className="text-red-500 mt-1">{String(errors.email.message)}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#2B2B2B] p-8"
            >
              <h2 className="text-3xl text-white mb-6">PROJECT DETAILS</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="material" className="block text-white mb-2">
                    Material Type *
                  </label>
                  <select
                    id="material"
                    {...register("material", { required: "Material is required" })}
                    className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                  >
                    <option value="">Select material</option>
                    <option value="mdf">MDF</option>
                    <option value="plywood">Plywood</option>
                    <option value="chipboard">Chipboard / Particle Board</option>
                    <option value="melamine">Melamine Board</option>
                    <option value="solid-wood">Solid Wood</option>
                    <option value="acrylic">Acrylic</option>
                    <option value="other">Other (specify in notes)</option>
                  </select>
                  {errors.material && (
                    <p className="text-red-500 mt-1">{String(errors.material.message)}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-white mb-2">
                    Quantity (pieces) *
                  </label>
                  <input
                    id="quantity"
                    type="text"
                    {...register("quantity", { required: "Quantity is required" })}
                    className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                    placeholder="e.g., 100 pieces"
                  />
                  {errors.quantity && (
                    <p className="text-red-500 mt-1">{String(errors.quantity.message)}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="deliveryTime" className="block text-white mb-2">
                    Required Delivery Time *
                  </label>
                  <select
                    id="deliveryTime"
                    {...register("deliveryTime", { required: "Delivery time is required" })}
                    className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                  >
                    <option value="">Select timeframe</option>
                    <option value="urgent">Urgent (1-2 weeks)</option>
                    <option value="standard">Standard (3-4 weeks)</option>
                    <option value="flexible">Flexible (1-2 months)</option>
                    <option value="long-term">Long-term Partnership</option>
                  </select>
                  {errors.deliveryTime && (
                    <p className="text-red-500 mt-1">{String(errors.deliveryTime.message)}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-white mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    {...register("notes")}
                    rows={4}
                    className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors resize-none"
                    placeholder="Any specific requirements, edge banding details, finishing instructions, etc."
                  />
                </div>
              </div>
            </motion.div>

            {/* File Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#2B2B2B] p-8"
            >
              <h2 className="text-3xl text-white mb-6">UPLOAD FILES</h2>
              
              <div className="border-2 border-dashed border-white/20 p-8 text-center hover:border-[#D4A017] transition-colors">
                <Upload className="w-16 h-16 text-[#D4A017] mx-auto mb-4" />
                <p className="text-white mb-2">
                  Drag and drop your files here or click to browse
                </p>
                <p className="text-white/60 text-sm mb-4">
                  Supported formats: CAD, PDF, SketchUp, STL, 3DM (Max 50MB per file)
                </p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept=".dwg,.dxf,.pdf,.skp,.stl,.3dm"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block bg-[#D4A017] text-[#111111] px-8 py-3 cursor-pointer hover:bg-[#D4A017]/90 transition-colors"
                >
                  SELECT FILES
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-2">
                  <p className="text-white mb-3">Uploaded Files:</p>
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-[#111111] p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#D4A017]" />
                        <span className="text-white">{file.name}</span>
                        <span className="text-white/50 text-sm">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                {acceptedFormats.map((format, index) => (
                  <div key={index} className="bg-[#111111] p-3 text-center">
                    <div className="text-[#D4A017] mb-1">{format.ext}</div>
                    <div className="text-white/50 text-xs">{format.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D4A017] text-[#111111] px-8 py-5 text-xl hover:bg-[#D4A017]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
                    SUBMITTING...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    SUBMIT QUOTE REQUEST
                  </>
                )}
              </button>
              <p className="text-white/60 text-center mt-4">
                We'll review your files and contact you within 24 hours with a detailed quote
              </p>
            </motion.div>
          </form>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#2B2B2B]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl text-white mb-4">WHY GET A QUOTE?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Transparent Pricing",
                description: "Detailed breakdown of costs with no hidden fees",
              },
              {
                title: "Fast Response",
                description: "Quote delivered within 24 hours of file submission",
              },
              {
                title: "Technical Support",
                description: "Our team reviews your designs and suggests optimizations",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#111111] p-8 text-center"
              >
                <h3 className="text-2xl text-white mb-3">{benefit.title}</h3>
                <p className="text-white/70">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
