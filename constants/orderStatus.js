export const OrderStatus = Object.freeze({
  Unpaid: "Unpaid",
  Paid: "Paid",
  Cancelled: "Cancelled",
  Expired: "Expired",
});

export const orderStatusLabel = {
  [OrderStatus.Unpaid]: "Chờ thanh toán",
  [OrderStatus.Paid]: "Đã thanh toán",
  [OrderStatus.Cancelled]: "Đã huỷ",
  [OrderStatus.Expired]: "Đã hết hạn",
};

export const orderStatusColor = {
  [OrderStatus.Unpaid]: "bg-amber-100 text-amber-800 border-amber-300",
  [OrderStatus.Paid]: "bg-emerald-100 text-emerald-800 border-emerald-300",
  [OrderStatus.Cancelled]: "bg-rose-100 text-rose-800 border-rose-300",
  [OrderStatus.Expired]: "bg-slate-200 text-slate-700 border-slate-300",
};

export const orderStatusOptions = [
  { value: OrderStatus.Unpaid, label: orderStatusLabel[OrderStatus.Unpaid] },
  { value: OrderStatus.Paid, label: orderStatusLabel[OrderStatus.Paid] },
  { value: OrderStatus.Cancelled, label: orderStatusLabel[OrderStatus.Cancelled] },
  { value: OrderStatus.Expired, label: orderStatusLabel[OrderStatus.Expired] },
];

export const TERMINAL_ORDER_STATUSES = Object.freeze([
  OrderStatus.Paid,
  OrderStatus.Cancelled,
  OrderStatus.Expired,
]);

export const isTerminalOrderStatus = (status) =>
  TERMINAL_ORDER_STATUSES.includes(status);
