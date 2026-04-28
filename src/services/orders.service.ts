const BASE_URL = "https://ecommerce.routemisr.com/api/v1";
const BASE_URL_V2 = "https://ecommerce.routemisr.com/api/v2";

const getHeaders = (token: string) => ({
  "Content-Type": "application/json",
  token: token,
});

export const createCashOrder = async (cartId: string, token: string, shippingAddress: object) => {
  const res = await fetch(`${BASE_URL_V2}/orders/${cartId}`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ shippingAddress }),
  });

  const data = await res.json();
  if (!res.ok || data.status === "fail") {
    throw new Error(data.message || "Failed to create order");
  }
  return data;
};

export const getUserOrders = async (userId: string, token: string) => {
  const res = await fetch(`${BASE_URL}/orders/user/${userId}`, {
    method: "GET",
    headers: getHeaders(token),
  });

  const data = await res.json();
  if (!res.ok || data.status === "fail") {
    throw new Error(data.message || "Failed to fetch orders");
  }
  return data;
};

export const createCheckoutSession = async (cartId: string, token: string, shippingAddress: object) => {
  const successUrl = `${window.location.origin}/orders`;
  const res = await fetch(`${BASE_URL}/orders/checkout-session/${cartId}?url=${successUrl}`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ shippingAddress }),
  });

  const data = await res.json();
  if (!res.ok || data.status === "fail") {
    throw new Error(data.message || "Failed to create checkout session");
  }
  return data;
};