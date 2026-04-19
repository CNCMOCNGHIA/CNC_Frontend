"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { theme } from "@/constants/theme";


export function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  const navLinks = [
    { path: "/", label: "TRANG CHỦ" },
    { path: "/gioi-thieu", label: "GIỚI THIỆU" },
    { path: "/dich-vu", label: "DỊCH VỤ" },
    { path: "/gia-cong", label: "GIA CÔNG" },
    // { path: "/workflow", label: "WORKFLOW" },
    { path: "/san-pham", label: "SẢN PHẨM" },
    { path: "/bai-viet", label: "BÀI VIẾT" },
    // { path: "/partners", label: "PARTNERS" },
    // { path: "/faq", label: "FAQ" },
    { path: "/lien-he", label: "LIÊN HỆ" },
  ];

  return (
    <div className={`min-h-screen ${theme.colors.bgSecondary} text-white`}>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? "backdrop-blur-md shadow-lg"
            : "bg-transparent"
          }`}
      >
        {/* Top Bar */}
        <div className="bg-[#D4A017] text-[#111111] py-2 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6">
              <a href="tel:+84123456789" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline font-body">+84 123 456 789</span>
              </a>
              <a href="mailto:info@mocnghiacnc.com" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline font-body">info@mocnghiacnc.com</span>
              </a>
            </div>
            <div className="font-body">
              Mon - Sat: 8:00 AM - 6:00 PM
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#D4A017] flex items-center justify-center">
                <span className="font-body font-bold text-2xl text-[#111111]">MN</span>
              </div>
              <div>
                <div className="font-body font-bold text-2xl leading-none tracking-wider text-white">
                  MOC NGHIA CNC
                </div>
                <div className="font-body text-xs text-[#D4A017] uppercase tracking-widest">
                  Furniture Processing
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`font-body text-sm tracking-wider transition-colors hover:text-[#D4A017] ${pathname === link.path ? "text-[#D4A017]" : "text-white"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white hover:text-[#D4A017] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[120px] left-0 right-0 z-40 bg-[#2B2B2B] lg:hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`block font-body text-sm tracking-wider transition-colors hover:text-[#D4A017] ${pathname === link.path ? "text-[#D4A017]" : "text-white"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-[120px]">
        {children || null}
      </main>

      {/* Footer */}
      <footer className="bg-[#2B2B2B] border-t border-[#D4A017]/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#D4A017] flex items-center justify-center">
                  <span className="font-body font-bold text-2xl text-[#111111]">MN</span>
                </div>
                <div>
                  <div className="font-body font-bold text-2xl leading-none tracking-wider text-white">
                    MOC NGHIA CNC
                  </div>
                  <div className="font-body text-xs text-[#D4A017] uppercase tracking-widest">
                    Furniture Processing
                  </div>
                </div>
              </div>
              <p className="font-body text-sm text-white/70 mb-4">
                Professional CNC furniture manufacturing and processing services. We specialize in precision cutting, edge banding, and custom furniture production for long-term B2B partnerships.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-body font-bold text-xl text-[#D4A017] mb-4 tracking-wider">QUICK LINKS</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/gioi-thieu" className="font-body text-sm text-white/70 hover:text-[#D4A017] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="font-body text-sm text-white/70 hover:text-[#D4A017] transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/gia-cong" className="font-body text-sm text-white/70 hover:text-[#D4A017] transition-colors">
                    Get Quote
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="font-body text-sm text-white/70 hover:text-[#D4A017] transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-body font-bold text-xl text-[#D4A017] mb-4 tracking-wider">CONTACT</h3>
              <div className="space-y-2">
                <p className="font-body text-sm text-white/70">
                  Phone: +84 123 456 789
                </p>
                <p className="font-body text-sm text-white/70">
                  Email: info@mocnghiacnc.com
                </p>
                <p className="font-body text-sm text-white/70">
                  Mon - Sat: 8:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#D4A017]/20 mt-8 pt-8 text-center">
            <p className="font-body text-sm text-white/50">
              © {new Date().getFullYear()} Moc Nghia CNC Furniture Processing Factory. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Zalo Chat Button */}
      <a
        href="https://zalo.me/84123456789"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#0068FF] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.875 1.395 5.45 3.566 7.208l-.437 3.274a.75.75 0 001.094.702l3.676-2.02c1.285.37 2.647.568 4.101.568 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm0 16.486c-1.36 0-2.66-.213-3.867-.611a.75.75 0 00-.547.038l-2.675 1.47.318-2.383a.75.75 0 00-.24-.662C3.47 15.22 2.5 13.325 2.5 11.243 2.5 6.977 6.753 3.5 12 3.5s9.5 3.477 9.5 7.743-4.253 7.743-9.5 7.743z" />
        </svg>
      </a>
    </div>
  );
}
