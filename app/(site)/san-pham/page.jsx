import ProductsView from "@/components/site/ProductsView";
import fallbackContent from "@/default-content/san-pham.json";
import { getPageContent } from "@/lib/server/page";

export default async function Products() {
  const content = await getPageContent("san-pham", fallbackContent);
  return <ProductsView content={content} />;
}
