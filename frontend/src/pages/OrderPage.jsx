import PayButton from "../components/PayButton";

export default function OrderPage({ order }) {
  const token = localStorage.getItem("token");

  return (
    <div>
      <h2>Order</h2>
      <p>Amount: ₹{order.totalAmount}</p>
      <p>Status: {order.paymentStatus}</p>

      <PayButton order={order} token={token} />
    </div>
  );
}