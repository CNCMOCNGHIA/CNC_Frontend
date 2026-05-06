"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Search, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { theme } from "@/constants/theme";
import { toSlug } from "@/lib/slug";
import fallbackContent from "@/default-content/cnc-infor.json";
import CartHeaderButton from "@/components/site/CartHeaderButton";

const HEADER_HEIGHT = 144; // px — top row (~88) + nav row (~56)

function getHref(item) {
  return item.path ?? `/san-pham/${toSlug(item.label)}`;
}

export function Layout({ children, content: contentProp }) {
  const content = contentProp ?? fallbackContent;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(() => new Set());
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileExpanded(new Set());
    setOpenDropdown(null);
    setOpenSubmenu(null);
    window.scrollTo(0, 0);
  }, [pathname]);

  const toggleMobileExpanded = (key) => {
    setMobileExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const isLinkActive = (link) =>
    pathname === link.path ||
    (link.children?.some((c) => c.path && c.path === pathname));

  const BrandLogo = ({ dark }) => (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-[#D4A017] flex items-center justify-center">
        <span className="font-body font-bold text-2xl text-[#111111]">
          {content.brand.initials}
        </span>
      </div>
      <div>
        <div className={`font-body font-bold text-lg leading-none tracking-wider ${dark ? "text-[#111111]" : "text-white"}`}>
          {content.brand.name}
        </div>
        <div className="font-body text-[10px] text-[#D4A017] uppercase tracking-widest mt-1">
          {content.brand.tagline}
        </div>
      </div>
    </div>
  );

  const renderSubmenuItem = (item, parentKey) => {
    const hasChildren = !!item.children?.length;
    const submenuKey = `${parentKey}/${item.label}`;
    const isHovered = openSubmenu === submenuKey;

    if (!hasChildren) {
      return (
        <Link
          key={item.label}
          href={getHref(item)}
          className="block px-6 py-3 font-body text-sm text-white hover:bg-[#D4A017] hover:text-[#111111] transition-colors uppercase tracking-wider"
        >
          {item.label}
        </Link>
      );
    }

    return (
      <div
        key={item.label}
        className="relative"
        onMouseEnter={() => setOpenSubmenu(submenuKey)}
        onMouseLeave={() => setOpenSubmenu(null)}
      >
        <Link
          href={getHref(item)}
          className={`flex items-center justify-between gap-4 px-6 py-3 font-body text-sm transition-colors uppercase tracking-wider ${
            isHovered
              ? "bg-[#D4A017] text-[#111111]"
              : "text-white hover:bg-[#D4A017] hover:text-[#111111]"
          }`}
        >
          <span>{item.label}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-0 left-full min-w-[260px] bg-[#2B2B2B] border-t-2 border-[#D4A017] shadow-xl py-2 z-50"
            >
              {item.children.map((sub) => (
                <Link
                  key={sub.label}
                  href={getHref(sub)}
                  className="block px-6 py-3 font-body text-sm text-white hover:bg-[#D4A017] hover:text-[#111111] transition-colors uppercase tracking-wider"
                >
                  {sub.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderDesktopLink = (link) => {
    const featured = link.featured;
    const baseClass = featured
      ? "h-full flex items-center gap-2 bg-[#D4A017] text-[#111111] hover:bg-[#D4A017]/90 px-6 font-body text-sm tracking-wider"
      : `h-full flex items-center gap-1 px-4 font-body text-sm tracking-wider transition-colors hover:text-[#D4A017] ${
          isLinkActive(link) ? "text-[#D4A017]" : "text-white"
        }`;

    if (!link.children) {
      return (
        <Link key={link.label} href={getHref(link)} className={baseClass}>
          {link.label}
        </Link>
      );
    }

    const isOpen = openDropdown === link.label;

    return (
      <div
        key={link.label}
        className="relative flex items-stretch"
        onMouseEnter={() => setOpenDropdown(link.label)}
        onMouseLeave={() => {
          setOpenDropdown(null);
          setOpenSubmenu(null);
        }}
      >
        <Link
          href={getHref(link)}
          className={`${baseClass} ${
            !featured && isOpen ? "text-[#D4A017]" : ""
          }`}
        >
          {link.label}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </Link>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-1/2 -translate-x-1/2 min-w-[280px] bg-[#2B2B2B] border-t-2 border-[#D4A017] shadow-xl z-50 py-2"
            >
              {link.children.map((child) => renderSubmenuItem(child, link.label))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderMobileLink = (link, parentKey = "") => {
    const key = `${parentKey}/${link.label}`;
    if (!link.children) {
      return (
        <Link
          key={key}
          href={getHref(link)}
          className={`block font-body text-sm tracking-wider transition-colors hover:text-[#D4A017] ${
            isLinkActive(link) ? "text-[#D4A017]" : "text-white"
          }`}
        >
          {link.label}
        </Link>
      );
    }
    const expanded = mobileExpanded.has(key);
    return (
      <div key={key}>
        <button
          type="button"
          onClick={() => toggleMobileExpanded(key)}
          className={`w-full flex items-center justify-between font-body text-sm tracking-wider transition-colors ${
            isLinkActive(link) ? "text-[#D4A017]" : "text-white"
          }`}
        >
          <span>{link.label}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
        {expanded && (
          <div className="mt-2 pl-4 border-l-2 border-[#D4A017]/40 space-y-2">
            {link.children.map((child) => renderMobileLink(child, key))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme.colors.bgSecondary} text-white`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 shadow-md">
        {/* Top Row — Logo + Search + Hotlines */}
        <div className="bg-[#f4f4f4]">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6">
            <Link href="/" className="shrink-0">
              <BrandLogo dark />
            </Link>

            {/* Search */}
            <form
              action="/san-pham"
              method="get"
              className="hidden md:flex flex-1 max-w-2xl"
            >
              <div className="relative w-full">
                <input
                  type="search"
                  name="q"
                  placeholder={content.topBar.searchPlaceholder}
                  className="w-full bg-white border border-gray-300 rounded-full px-5 py-2.5 pr-12 text-sm text-[#111111] placeholder-gray-400 focus:outline-none focus:border-[#D4A017]"
                />
                <button
                  type="submit"
                  aria-label="Tìm kiếm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#D4A017] transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Hotlines (desktop) */}
            <div className="hidden xl:flex items-center gap-6 shrink-0">
              {content.topBar.hotlines.map((h, i) => (
                <a
                  key={i}
                  href={`tel:${h.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-[#111111] hover:text-[#D4A017] transition-colors"
                >
                  <Phone className="w-6 h-6 text-[#D4A017]" />
                  <div>
                    <div className="font-body text-xs text-[#666]">{h.label}</div>
                    <div className="font-body font-bold text-sm">{h.phone}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Cart */}
            <CartHeaderButton />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden ml-auto text-[#111111] hover:text-[#D4A017] transition-colors shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile-only search */}
        <form
          action="/san-pham"
          method="get"
          className="md:hidden bg-[#f4f4f4] px-4 pb-3"
        >
          <div className="relative">
            <input
              type="search"
              name="q"
              placeholder={content.topBar.searchPlaceholder}
              className="w-full bg-white border border-gray-300 rounded-full px-5 py-2 pr-10 text-sm text-[#111111] placeholder-gray-400 focus:outline-none focus:border-[#D4A017]"
            />
            <button
              type="submit"
              aria-label="Tìm kiếm"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Nav Row — Desktop */}
        <div className="hidden lg:block bg-[#1f1f1f] border-t border-[#D4A017]/30">
          <nav className="max-w-7xl mx-auto flex items-stretch h-14">
            {content.navLinks.map((link) => renderDesktopLink(link))}
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed left-0 right-0 z-40 bg-[#2B2B2B] lg:hidden overflow-y-auto"
            style={{ top: HEADER_HEIGHT, maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}
          >
            <div className="px-4 py-6 space-y-4">
              {content.navLinks.map((link) => renderMobileLink(link))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main style={{ paddingTop: HEADER_HEIGHT }}>{children || null}</main>

      {/* Footer */}
      <footer className="bg-[#2B2B2B] border-t border-[#D4A017]/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <BrandLogo />
              </div>
              <p className="font-body text-sm text-white/70 mb-4">
                {content.footer.description}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-body font-bold text-xl text-[#D4A017] mb-4 tracking-wider">
                {content.footer.quickLinks.heading}
              </h3>
              <ul className="space-y-2">
                {content.footer.quickLinks.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-body text-sm text-white/70 hover:text-[#D4A017] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-body font-bold text-xl text-[#D4A017] mb-4 tracking-wider">
                {content.footer.contact.heading}
              </h3>
              <div className="space-y-2">
                {content.footer.contact.items.map((item, index) => (
                  <p key={index} className="font-body text-sm text-white/70">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-[#D4A017]/20 mt-8 pt-8 text-center">
            <p className="font-body text-sm text-white/50">
              © {new Date().getFullYear()} {content.footer.copyright}
            </p>
          </div>
        </div>
      </footer>

      {/* Zalo Chat Button */}
      <a
        href={content.zalo.href}
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
