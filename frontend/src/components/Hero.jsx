import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="subheading-business">
                Premium Rental Service
              </span>
              <h1 className="heading-hero">
                Elevate Your Living Space{" "}
                <span className="text-indigo-600">On Your Terms.</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl font-medium">
                High-quality furniture and appliances delivered to your door.
                Flexible monthly plans designed for modern moving.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/how-it-works" className="btn-premium group">
                Browse Collection
                <ShoppingBag size={18} />
              </Link>
              <Link to="/how-it-works" className="btn-secondary">
                How it works
              </Link>
            </div>

            <div className="pt-8 grid grid-cols-2 gap-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-1 rounded-full">
                  <CheckCircle2 className="text-emerald-500" size={16} />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Free 24h Setup
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-1 rounded-full">
                  <CheckCircle2 className="text-emerald-500" size={16} />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  No Commitments
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop"
                alt="Modern Living Room"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
            </div>

            {/* Value Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-slate-100 hidden md:block">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                Starting from
              </p>
              <p className="text-3xl font-bold text-slate-900">
                ₹499
                <span className="text-sm text-slate-400 font-medium">/mo</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};



export default Hero;
