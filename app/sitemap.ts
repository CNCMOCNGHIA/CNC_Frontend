// export default function sitemap() {
//   const baseUrl = 'http://localhost:3000';

//   const routes = [
//     '',
//     '/blog',
//     '/contact',
//     '/dich-vu',
//     '/faq',
//     '/gioi-thieu',
//     '/partners',
//     '/quote',
//     '/san-pham',
//     '/workflow',
//   ];

//   const blogRoutes = blogData.map((post: any) => ({
//     url: `${baseUrl}/blog/${post.slug}`,
//     lastModified: new Date(),
//   }));

//   return [
//     ...staticRoutes.map((route) => ({
//       url: `${baseUrl}${route}`,
//       lastModified: new Date(),
//     })),
//     ...blogRoutes,
//   ];
// }