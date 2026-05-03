import { createOrder, verifyPayment } from "../services/paymentService";

export default function PayButton({ order, token }) {
  const handlePayment = async () => {
    try {
      // 1. create order
      const res = await createOrder(order._id, token);

      if (!res.success) {
        alert(res.message);
        return;
      }

      const { orderId, amount } = res.data;

      // 2. open razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        name: "Your App",
        description: "Order Payment",
        order_id: orderId,

        handler: async function (response) {
          // 3. verify payment
          const verifyRes = await verifyPayment(
            {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            },
            token
          );

          if (verifyRes.success) {
            alert("Payment successful 🎉");
            window.location.reload();
          } else {
            alert("Verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        alert("Payment failed");
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Pay Now
    </button>
  );
}