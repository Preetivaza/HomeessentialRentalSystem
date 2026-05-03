import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Browse Products",
    desc: "Explore furniture, appliances, and more.",
  },
  {
    title: "Select Duration",
    desc: "Choose flexible rental duration.",
  },
  {
    title: "Make Payment",
    desc: "Secure payment using Razorpay.",
  },
  {
    title: "Delivery & Setup",
    desc: "Get fast delivery and free setup.",
  },
];

export default function HowItWorks() {
  return (
    <div className="pt-28 pb-20 bg-white min-h-screen">
      {/* Title */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900">
          How It <span className="text-indigo-600">Works</span>
        </h1>
        <p className="text-slate-600 mt-4">
          Simple steps to start renting instantly.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="p-6 border rounded-xl shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              {i + 1}. {step.title}
            </h2>
            <p className="text-slate-600">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-20">
        <Link
          to="/products"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
