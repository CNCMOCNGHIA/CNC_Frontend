import "server-only";

const CACHE_REVALIDATE_SECONDS = 60;

export async function getPageContent(slug, fallback) {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") return fallback;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return fallback;

  try {
    const res = await fetch(`${apiUrl}/pages/${slug}`, {
      next: {
        revalidate: CACHE_REVALIDATE_SECONDS,
        tags: [`page:${slug}`],
      },
    });
    if (!res.ok) return fallback;
    const json = await res.json();
    return json?.data?.content ?? fallback;
  } catch (error) {
    console.error(`getPageContent("${slug}") failed:`, error);
    return fallback;
  }
}
