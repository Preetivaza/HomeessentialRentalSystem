// // api.js

const API = import.meta.env.VITE_API_URL;

// -----------------------------
// 🔧 Helper function
// -----------------------------
const request = async (url, options = {}) => {
  try {
    const res = await fetch(`${API}${url}`, {
      credentials: "include", // important for auth cookies
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};


// -----------------------------
// 🔐 AUTH APIs
// -----------------------------

export const loginUser = (data) =>
  request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const registerUser = (data) =>
  request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const logoutUser = () =>
  request("/api/auth/logout", {
    method: "POST",
  });

export const getCurrentUser = () =>
  request("/api/auth/me");


// -----------------------------
// 🛍️ PRODUCT APIs
// -----------------------------

export const getProducts = (query = "") =>
  request(`/api/products${query}`);

export const getProductById = (id) =>
  request(`/api/products/${id}`);

export const checkAvailability = (id, query) =>
  request(`/api/products/${id}/availability?${query}`);

export const calculateCost = (id, data) =>
  request(`/api/products/${id}/calculate`, {
    method: "POST",
    body: JSON.stringify(data),
  });


// -----------------------------
// 🧾 ORDER APIs
// -----------------------------

export const createOrder = (data) =>
  request("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getOrders = () =>
  request("/api/orders");

export const getOrderById = (id) =>
  request(`/api/orders/${id}`);


// -----------------------------
// 👤 USER APIs (Protected)
// -----------------------------

export const getUsers = () =>
  request("/api/users");

export const getUserStats = () =>
  request("/api/users/stats");


// -----------------------------
// 💳 PAYMENT APIs
// -----------------------------

export const createPaymentIntent = (data) =>
  request("/api/payments/create-intent", {
    method: "POST",
    body: JSON.stringify(data),
  });


// -----------------------------
// 📊 DASHBOARD APIs
// -----------------------------

export const getDashboardData = () =>
  request("/api/dashboard");


// -----------------------------
// 📦 BUNDLE APIs
// -----------------------------

export const getBundles = () =>
  request("/api/bundles");