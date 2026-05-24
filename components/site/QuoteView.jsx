"use client";

import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { theme } from "@/constants/theme";
import { Breadcrumb } from "@/components/breadcrumb";
import { resolveImageUrl } from "@/lib/format";
import {
  createQuota,
  parseQuotaValidationErrors,
  QUOTA_ALLOWED_EXTENSIONS,
  VN_PHONE_REGEX,
} from "@/services/quota";

const FORM_TO_API_FIELD = {
  name: "FullName",
  phone: "PhoneNumber",
  email: "Email",
  material: "MaterialType",
  quantity: "Quantity",
  deliveryTime: "DeliveryTime",
  notes: "Note",
};

const API_TO_FORM_FIELD = Object.fromEntries(
  Object.entries(FORM_TO_API_FIELD).map(([k, v]) => [v, k])
);

const getExtension = (name) => {
  if (!name) return "";
  const idx = name.lastIndexOf(".");
  return idx >= 0 ? name.slice(idx).toLowerCase() : "";
};

export default function QuoteView({ content }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    hero,
    contactSection,
    projectSection,
    uploadSection,
    submitSection,
    benefitsSection,
  } = content ?? {};

  const handleFileChange = (e) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);
    const rejected = incoming.filter(
      (f) => !QUOTA_ALLOWED_EXTENSIONS.includes(getExtension(f.name))
    );
    if (rejected.length) {
      toast.error(
        `Định dạng không hỗ trợ: ${rejected.map((f) => f.name).join(", ")}`
      );
    }
    const accepted = incoming.filter(
      (f) => QUOTA_ALLOWED_EXTENSIONS.includes(getExtension(f.name))
    );
    if (accepted.length) {
      setFiles((prev) => [...prev, ...accepted]);
    }
    // Cho phép chọn lại cùng file sau khi xoá
    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await createQuota({
        fullName: formData.name,
        phoneNumber: formData.phone,
        email: formData.email,
        materialType: formData.material,
        quantity: Number(formData.quantity),
        deliveryTime: formData.deliveryTime,
        note: formData.notes,
        files,
      });
      toast.success(submitSection?.successMessage ?? "Đã gửi yêu cầu");
      reset();
      setFiles([]);
    } catch (error) {
      const fieldErrors = parseQuotaValidationErrors(error);
      if (fieldErrors) {
        for (const [apiField, message] of Object.entries(fieldErrors)) {
          const formField = API_TO_FORM_FIELD[apiField];
          if (formField) {
            setError(formField, { type: "server", message });
          }
        }
        toast.error("Vui lòng kiểm tra lại các trường được đánh dấu");
      } else {
        const msg =
          error?.messages?.[0] ??
          error?.response?.data?.messages?.[0] ??
          error?.message ??
          "Gửi yêu cầu thất bại";
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${theme.fonts.body} ${theme.colors.lightText}`}>
      {hero && (
        <section className="relative h-[50vh] min-h-[400px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${resolveImageUrl(hero.backgroundImage)}')` }}
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
      )}

      <Breadcrumb items={[{ label: "Gia công" }]} />

      <section className={`py-12 ${theme.colors.bgPrimary}`}>
        <div className="max-w-7xl mx-auto px-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            {contactSection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#2B2B2B] p-8"
              >
                <h2 className="text-3xl text-white mb-6">{contactSection.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white mb-2">
                      {contactSection.fields?.name?.label} *
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("name", {
                        required: "Vui lòng nhập họ tên",
                        maxLength: { value: 100, message: "Tối đa 100 ký tự" },
                      })}
                      className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                      placeholder={contactSection.fields?.name?.placeholder}
                    />
                    {errors.name && (
                      <p className="text-red-500 mt-1">{String(errors.name.message)}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-white mb-2">
                      {contactSection.fields?.phone?.label} *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register("phone", {
                        required: "Vui lòng nhập số điện thoại",
                        pattern: {
                          value: VN_PHONE_REGEX,
                          message:
                            "SĐT không hợp lệ (VD: 0901234567 hoặc +84901234567)",
                        },
                      })}
                      className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                      placeholder={contactSection.fields?.phone?.placeholder}
                    />
                    {errors.phone && (
                      <p className="text-red-500 mt-1">{String(errors.phone.message)}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-white mb-2">
                      {contactSection.fields?.email?.label} *
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Vui lòng nhập email",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email không hợp lệ",
                        },
                      })}
                      className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                      placeholder={contactSection.fields?.email?.placeholder}
                    />
                    {errors.email && (
                      <p className="text-red-500 mt-1">{String(errors.email.message)}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {projectSection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-[#2B2B2B] p-8"
              >
                <h2 className="text-3xl text-white mb-6">{projectSection.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="material" className="block text-white mb-2">
                      {projectSection.fields?.material?.label} *
                    </label>
                    <select
                      id="material"
                      {...register("material", { required: "Vui lòng chọn vật liệu" })}
                      className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                    >
                      <option value="">-- Chọn vật liệu --</option>
                      {(projectSection.fields?.material?.options ?? []).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.material && (
                      <p className="text-red-500 mt-1">{String(errors.material.message)}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-white mb-2">
                      {projectSection.fields?.quantity?.label} *
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min={1}
                      step={1}
                      {...register("quantity", {
                        required: "Vui lòng nhập số lượng",
                        valueAsNumber: true,
                        validate: (v) =>
                          (Number.isInteger(v) && v >= 1) ||
                          "Số lượng phải là số nguyên ≥ 1",
                      })}
                      className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                      placeholder={projectSection.fields?.quantity?.placeholder}
                    />
                    {errors.quantity && (
                      <p className="text-red-500 mt-1">{String(errors.quantity.message)}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="deliveryTime" className="block text-white mb-2">
                      {projectSection.fields?.deliveryTime?.label}
                    </label>
                    <select
                      id="deliveryTime"
                      {...register("deliveryTime")}
                      className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors"
                    >
                      <option value="">-- Chọn thời gian --</option>
                      {(projectSection.fields?.deliveryTime?.options ?? []).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-white mb-2">
                      {projectSection.fields?.notes?.label}
                    </label>
                    <textarea
                      id="notes"
                      {...register("notes")}
                      rows={4}
                      className="w-full bg-[#111111] border border-white/10 text-white px-4 py-3 focus:border-[#D4A017] focus:outline-none transition-colors resize-none"
                      placeholder={projectSection.fields?.notes?.placeholder}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {uploadSection && (
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
                    accept={QUOTA_ALLOWED_EXTENSIONS.join(",")}
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
                          {uploadSection.removeLabel}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                  {(uploadSection.acceptedFormats ?? []).map((format, index) => (
                    <div key={index} className="bg-[#111111] p-3 text-center">
                      <div className="text-[#D4A017] mb-1">{format.ext}</div>
                      <div className="text-white/50 text-xs">{format.desc}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {submitSection && (
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
            )}
          </form>
        </div>
      </section>

      {benefitsSection && (
        <section className="py-20 bg-[#2B2B2B]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-7xl text-white mb-4">
                {benefitsSection.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(benefitsSection.items ?? []).map((benefit, index) => (
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
      )}
    </div>
  );
}
