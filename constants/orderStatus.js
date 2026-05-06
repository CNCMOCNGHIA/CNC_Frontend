export const OrderStatus = Object.freeze({
  Unpaid: 0,
  Paid: 1,
  Cancelled: 2,
});

export const orderStatusLabel = {
  [OrderStatus.Unpaid]: "Chưa thanh toán",
  [OrderStatus.Paid]: "Đã thanh toán",
  [OrderStatus.Cancelled]: "Đã huỷ",
};

export const orderStatusColor = {
  [OrderStatus.Unpaid]: "bg-amber-100 text-amber-800 border-amber-300",
  [OrderStatus.Paid]: "bg-emerald-100 text-emerald-800 border-emerald-300",
  [OrderStatus.Cancelled]: "bg-rose-100 text-rose-800 border-rose-300",
};

export const orderStatusOptions = [
  { value: OrderStatus.Unpaid, label: orderStatusLabel[OrderStatus.Unpaid] },
  { value: OrderStatus.Paid, label: orderStatusLabel[OrderStatus.Paid] },
  { value: OrderStatus.Cancelled, label: orderStatusLabel[OrderStatus.Cancelled] },
];
