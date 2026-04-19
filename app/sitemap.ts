import { MetadataRoute } from 'next'

// Nếu bạn có data thật thì import vào đây
// import { blogData } from '@/data/blog'

export const dynamic = 'force-static'
// hoặc nếu blog update thường xuyên thì dùng:
// export const revalidate = 60 * 60 // 1h

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://your-domain.com'

  // Static routes
  const staticRoutes = [
    '',
    '/blog',
    '/contact',
    '/dich-vu',
    '/faq',
    '/gioi-thieu',
    '/partners',
    '/quote',
    '/san-pham',
    '/workflow',
  ]

  const staticPages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7,
  }))

  // Fake blog data (thay bằng data thật của bạn)
  const blogData = [
    {
      slug: 'bai-viet-1',
      updatedAt: '2026-04-01',
    },
    {
      slug: 'bai-viet-2',
      updatedAt: '2026-04-10',
    },
  ]

  const blogPages: MetadataRoute.Sitemap = blogData.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages]
}