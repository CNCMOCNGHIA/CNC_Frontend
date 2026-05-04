"use client";

import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { theme } from "@/constants/theme";
import { Breadcrumb } from "@/components/breadcrumb";
import data from "@/default-content/gia-cong.json";

export default function Quote() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { hero, contactSection, projectSection, uploadSection, submitSection, benefitsSection } = data;

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Quote Request:", { ...formData, files });
    toast.success(submitSection.successMessage);
    reset();
    setFiles([]);
    setIsSubmitting(false);
  };

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>

      {/* Hero Section */}
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
            <p className="text-xl text-white/80 max-w-2xl">{hero.description}</p>
          </motion.div>
        </div>
      </section>

      <Breadcrumb items={[{ label: "Gia công" }]} />

      {/* Form Section */}
      <section className={`py-12 ${theme.colors.bgPrimary}`}>
        <div className="max-w-7xl mx-auto px-4">
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#2B2B2B] p-8"
            >
              <h2 className="text-3xl text-white mb-6">{contactSection.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-white mb-2">
                    {contactSection.fields.name.label} *
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                    placeholder={contactSection.fields.name.placeholder}
                  />
                  {errors.name && <p className="text-red-500 mt-1">{String(errors.name.message)}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-white mb-2">
                    {contactSection.fields.phone.label} *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register("phone", { required: "Phone is required" })}
                    className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                    placeholder={contactSection.fields.phone.placeholder}
                  />
                  {errors.phone && <p className="text-red-500 mt-1">{String(errors.phone.message)}</p>}
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-white mb-2">
                    {contactSection.fields.email.label} *
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
                    placeholder={contactSection.fields.email.placeholder}
                  />
                  {errors.email && <p className="text-red-500 mt-1">{String(errors.email.message)}</p>}
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
              <h2 className="text-3xl text-white mb-6">{projectSection.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Material */}
                <div>
                  <label htmlFor="material" className="block text-white mb-2">
                    {projectSection.fields.material.label} *
                  </label>
                  <select
                    id="material"
                    {...register("material", { required: "Material is required" })}
                    className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                  >
                    {projectSection.fields.material.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.material && <p className="text-red-500 mt-1">{String(errors.material.message)}</p>}
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor="quantity" className="block text-white mb-2">
                    {projectSection.fields.quantity.label} *
                  </label>
                  <input
                    id="quantity"
                    type="text"
                    {...register("quantity", { required: "Quantity is required" })}
                    className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                    placeholder={projectSection.fields.quantity.placeholder}
                  />
                  {errors.quantity && <p className="text-red-500 mt-1">{String(errors.quantity.message)}</p>}
                </div>

                {/* Delivery Time */}
                <div>
                  <label htmlFor="deliveryTime" className="block text-white mb-2">
                    {projectSection.fields.deliveryTime.label} *
                  </label>
                  <select
                    id="deliveryTime"
                    {...register("deliveryTime", { required: "Delivery time is required" })}
                    className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                  >
                    {projectSection.fields.deliveryTime.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.deliveryTime && <p className="text-red-500 mt-1">{String(errors.deliveryTime.message)}</p>}
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-white mb-2">
                    {projectSection.fields.notes.label}
                  </label>
                  <textarea
                    id="notes"
                    {...register("notes")}
                    rows={4}
                    className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors resize-none"
                    placeholder={projectSection.fields.notes.placeholder}
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
              <h2 className="text-3xl text-white mb-6">{uploadSection.title}</h2>

              <div className="border-2 border-dashed border-white/20 p-8 text-center hover:border-[#D4A017] transition-colors">
                <Upload className="w-16 h-16 text-[#D4A017] mx-auto mb-4" />
                <p className="text-white mb-2">{uploadSection.dragText}</p>
                <p className="text-white/60 text-sm mb-4">{uploadSection.formatNote}</p>
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
                  {uploadSection.selectButtonLabel}
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-2">
                  <p className="text-white mb-3">{uploadSection.uploadedFilesLabel}</p>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#111111] p-3">
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
                        {uploadSection.removeLabel}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                {uploadSection.acceptedFormats.map((format, index) => (
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
                className="w-full bg-[#D4A017] text-[#111111] px-8 py-5 text-xl hover:bg-[#D4A017]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-3 mt-4"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
                    {submitSection.submittingLabel}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    {submitSection.buttonLabel}
                  </>
                )}
              </button>
              <p className="text-white/60 text-center mt-4">{submitSection.note}</p>
            </motion.div>

          </form>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#2B2B2B]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl text-white mb-4">{benefitsSection.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefitsSection.items.map((benefit, index) => (
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