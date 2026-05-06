import ServicesView from "@/components/site/ServicesView";
import fallbackContent from "@/default-content/dich-vu.json";
import { getPageContent } from "@/lib/server/page";

export default async function Services() {
  const content = await getPageContent("dich-vu", fallbackContent);
  return <ServicesView content={content} />;
}
