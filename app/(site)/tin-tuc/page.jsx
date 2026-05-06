import BlogView from "@/components/site/BlogView";
import fallbackContent from "@/default-content/tin-tuc.json";
import { getPageContent } from "@/lib/server/page";

export default async function Blog() {
  const content = await getPageContent("tin-tuc", fallbackContent);
  return <BlogView content={content} />;
}
