import ContactView from "@/components/site/ContactView";
import fallbackContent from "@/default-content/lien-he.json";
import { getPageContent } from "@/lib/server/page";

export default async function Contact() {
  const content = await getPageContent("lien-he", fallbackContent);
  return <ContactView content={content} />;
}
