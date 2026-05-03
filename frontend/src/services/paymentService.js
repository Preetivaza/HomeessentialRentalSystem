const API = import.meta.env.VITE_API_URL;

// create order
export const createOrder = async (orderId, token) => {
  const res = await fetch(`${API}/payments/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId }),
  });

  return res.json();
};

// verify payment
export const verifyPayment = async (data, token) => {
  const res = await fetch(`${API}/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};