import HomeView from "@/components/site/HomeView";
import fallbackContent from "@/default-content/trang-chu.json";
import { getPageContent } from "@/lib/server/page";

export default async function Home() {
  const content = await getPageContent("trang-chu", fallbackContent);
  return <HomeView content={content} />;
}
