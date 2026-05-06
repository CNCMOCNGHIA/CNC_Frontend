import { Layout as SiteLayout } from "@/components/layout";
import fallbackContent from "@/default-content/cnc-infor.json";
import { getPageContent } from "@/lib/server/page";

export default async function PublicSiteLayout({ children }) {
  const content = await getPageContent("cnc-infor", fallbackContent);
  return <SiteLayout content={content}>{children}</SiteLayout>;
}
