import AboutView from "@/components/site/AboutView";
import fallbackContent from "@/default-content/gioi-thieu.json";
import { getPageContent } from "@/lib/server/page";

export default async function About() {
  const content = await getPageContent("gioi-thieu", fallbackContent);
  return <AboutView content={content} />;
}
