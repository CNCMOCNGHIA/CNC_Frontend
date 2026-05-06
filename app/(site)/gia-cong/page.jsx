import QuoteView from "@/components/site/QuoteView";
import fallbackContent from "@/default-content/gia-cong.json";
import { getPageContent } from "@/lib/server/page";

export default async function Quote() {
  const content = await getPageContent("gia-cong", fallbackContent);
  return <QuoteView content={content} />;
}
