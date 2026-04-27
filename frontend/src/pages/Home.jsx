import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import Hero from '../components/Hero'
import { ArrowRight, Shield, Truck, Zap, Heart, CheckCircle2 } from 'lucide-react'
import { productService } from '../services/productService'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productService.getProducts({ limit: 4 });
        if (data.success && data.data && data.data.products) {
          setFeaturedProducts(data.data.products);
        }
      } catch (error) {
        console.error("Failed to fetch featured products", error);
      }
    };
    fetchFeatured();
  }, []);

  const features = [
    {
      icon: <Truck className="w-6 h-6 text-indigo-600" />,
      title: "24h Express Setup",
      desc: "Priority delivery and professional installation included with every plan.",
    },
    {
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      title: "Flexible Terms",
      desc: "Upgrade, swap, or return items anytime. Your lifestyle, your rules.",
    },
    {
      icon: <Shield className="w-6 h-6 text-indigo-600" />,
      title: "Full Protection",
      desc: "Our comprehensive coverage ensures you're never liable for minor wear.",
    }
  ]

  return (
    <div className="bg-white">
      <Hero />


      {/* Features Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {features.map((f, i) => (
              <div key={i} className="space-y-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 lg:py-32 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <span className="subheading-business">Shop the collection</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Featured Essentials</h2>
              <p className="text-slate-600 mt-4 font-medium">Carefully selected premium items for your modern home.</p>
            </div>
            <Link to="/products" className="btn-secondary group">
              Explore Store
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotion Section */}
      <section className="py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-indigo-600 rounded-2xl p-10 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
            <div className="relative z-10 flex-1">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Get 20% Off Your First Month 
              </h2>
              <p className="text-lg text-indigo-100 mb-10 max-w-lg font-medium">
                New to the platform? Start your rental journey today and save 
                on any furniture or appliance bundle.
              </p>
              <Link to="/products" className="inline-flex px-8 py-4 bg-white text-indigo-600 rounded-lg font-bold hover:bg-indigo-50 transition-all">
                View All Deals
              </Link>
            </div>

            <div className="flex-1 w-full max-w-md hidden lg:block">
               <img 
                 src="https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?q=80&w=1974&auto=format&fit=crop" 
                 alt="Promotion Banner" 
                 className="rounded-xl shadow-2xl w-full h-80 object-cover"
               />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="pb-32 text-center">
        <div className="max-w-3xl mx-auto px-6 py-20 border-t border-slate-100">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8">
             Living your best life is just a click away.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/products" className="btn-premium px-10 py-4 font-bold text-lg">
              Get Started Now
            </Link>
            <Link to="/products" className="btn-secondary px-10 py-4 font-bold text-lg">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
