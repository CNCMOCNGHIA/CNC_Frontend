import api from "./api.js";

// Backend: Orders
//   POST   /api/orders                                     Public  guest checkout
//   GET    /api/orders/{orderId}                           Public  detail (no auth)
//   GET    /api/orders?pageNumber=&pageSize=&status=&customerPhone=
//                                                          Admin   list + filter
//   PATCH  /api/orders/{orderId}/status                    Admin   { status: 0|1|2 }
//
// Status enum: 0 = Unpaid, 1 = Paid, 2 = Cancelled (see constants/orderStatus.js)
//
// Create body:
//   { customerName, customerPhone, customerEmail?, shippingAddress, note?,
//     items: [{ productId, quantity }] }

export const createOrder = async (payload) => {
  try {
    const response = await api.post("/api/orders", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getOrder = async (id) => {
  try {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const getOrders = async ({
  pageNumber = 1,
  pageSize = 10,
  status,
  customerPhone,
} = {}) => {
  try {
    const response = await api.get("/api/orders", {
      params: {
        pageNumber,
        pageSize,
        ...(status !== undefined && status !== null && status !== ""
          ? { status }
          : {}),
        ...(customerPhone ? { customerPhone } : {}),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.patch(`/api/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
