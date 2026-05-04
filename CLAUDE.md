# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Next.js dev server (Turbopack via Next 15 default).
- `npm run build` — production build. ESLint is intentionally skipped during build (`next.config.ts` → `eslint.ignoreDuringBuilds: true`), so do not rely on the build to surface lint errors.
- `npm run start` — run the production server after a build.

There is no lint, format, or test script configured. There is no test suite — do not invent commands or claim a "tests pass" without one.

## Stack & Conventions

- **Next.js 15 App Router**, React 18. Most page components are JSX (`.jsx`) and start with `"use client"`; only a handful of files are TS (`lib/slug.ts`, `app/sitemap.ts`, `next.config.ts`, and `components/ui/*.tsx` from shadcn).
- **TypeScript is permissive**: `strict: false`, `allowJs: true`, `noEmit: true`. Path alias `@/*` resolves to the repo root, so imports look like `@/components/layout`, `@/default-content/trang-chu.json`, `@/constants/theme`, `@/lib/slug`.
- **Tailwind v4** via `@tailwindcss/postcss`. Global styles live in `app/globals.css` → `app/styles/{fonts,tailwind,theme}.css`. Design tokens are CSS variables in `app/styles/theme.css` and exposed to Tailwind through `@theme inline`.
- **UI primitives**: `components/ui/*` is shadcn/ui (Radix + CVA). Use `cn()` from `components/ui/utils.ts` to compose class names. Toaster is wired through `app/providers.jsx` (Sonner).
- **Animation**: `motion/react` (Framer Motion v12) is used pervasively for fade/slide-in section transitions. Icons come from `lucide-react`.
- **Routes are Vietnamese-slugged**: `/gioi-thieu`, `/dich-vu`, `/gia-cong`, `/san-pham`, `/tin-tuc`, `/lien-he`, plus `/faq`, `/partners`, `/workflow`. Dynamic routes exist at `app/san-pham/[slug]` and `app/tin-tuc/[slug]`. Use `toSlug()` from `lib/slug.ts` to generate slugs from Vietnamese titles (it strips diacritics).

## Architecture

### Layout shell (`components/layout.jsx`)
A single client component renders the header (with scroll-based blur), top bar, mobile nav, footer, and floating Zalo button. It is wrapped around all routes in `app/layout.jsx`. It reads brand/nav/footer data from `default-content/cnc-infor.json`. When adding a top-level page, also add a nav entry to that JSON — pages do **not** auto-register in the navbar.

### Content-as-JSON pattern (the central architectural decision)
Every page is a presentational component that imports its copy/imagery from a sibling file in `default-content/*.json`:

| Page | Content file |
| --- | --- |
| `app/page.jsx` | `default-content/trang-chu.json` |
| `app/dich-vu/page.jsx` | `default-content/dich-vu.json` |
| `app/gia-cong/page.jsx` | `default-content/gia-cong.json` |
| `app/gioi-thieu/page.jsx` | `default-content/gioi-thieu.json` |
| `app/lien-he/page.jsx` | `default-content/lien-he.json` |
| `app/san-pham/page.jsx` | `default-content/san-pham.json` |
| `app/san-pham/[slug]/page.jsx` | `default-content/san-pham-detail.json` |
| `app/tin-tuc/page.jsx` | `default-content/tin-tuc.json` |
| `app/tin-tuc/[slug]/page.jsx` | `default-content/tin-tuc-detail.json` |
| header/footer/nav | `default-content/cnc-infor.json` |

When the user asks to "change the headline / hero text / CTA / images" on a page, the change almost always belongs in the page's JSON, not in the JSX. The JSX consumes a fixed shape (e.g. `hero`, `stats`, `servicesSection`, `whyChooseUs`, `cta` for the home page) — if you add a new field, you must update both the JSON and the destructure in the page.

These pages are still client components and the JSON is bundled at build time; this is **not** a CMS. There is no fetch layer.

Heads-up: `app/tin-tuc/[slug]/page.jsx` currently imports `@/default-content/bai-viet-detail.json` but the file on disk is `tin-tuc-detail.json`. If a task touches blog detail, expect to reconcile this.

### Theming (`constants/theme.js`)
A flat object of Tailwind class-string tokens (e.g. `theme.colors.brand` → `"bg-[#D4A017]"`, `theme.text.heroTitle` → `"text-5xl md:text-7xl"`). Pages compose layouts as `${theme.colors.bgSecondary} ${theme.colors.lightText}` template strings rather than calling utilities directly. To stay consistent with the existing palette (charcoal `#2B2B2B`, gold `#D4A017`, off-black `#111111`), prefer adding a token here over inlining new arbitrary-value classes.

The same palette is also defined as CSS variables in `app/styles/theme.css` for the shadcn components — keep the two in sync if you change brand colors.

### Fonts
`Montserrat` is loaded via `next/font/google` in `app/layout.jsx` and exposed as `--font-montserrat` (used by the `.font-body` utility). `Bebas Neue` is pulled from a Google Fonts `@import` in `app/styles/fonts.css` and applied to `h1`/`h2` in the base layer.

## When making changes

- Editing copy/images on a page: change the matching `default-content/*.json`, not the JSX.
- Adding a new top-level route: create `app/<slug>/page.jsx`, create the matching `default-content/<slug>.json`, add the link to `cnc-infor.json` `navLinks`, and add the route to the array in `app/sitemap.ts`.
- Building new sections: prefer `theme` tokens for color/spacing/type, `motion/react` for entry animations matching the existing `initial/whileInView` pattern, and shadcn `components/ui/*` for form/dialog primitives.
- The `app/sitemap.ts` `baseUrl` is currently `https://your-domain.com` (placeholder) — don't assume it reflects the real production host.
