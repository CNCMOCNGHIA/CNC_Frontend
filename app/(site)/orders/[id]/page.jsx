import OrderTrackingView from "@/components/site/OrderTrackingView";

export const metadata = {
  title: "Theo dõi đơn hàng",
};

export default async function OrderPage({ params }) {
  const { id } = await params;
  return <OrderTrackingView orderId={id} />;
}
