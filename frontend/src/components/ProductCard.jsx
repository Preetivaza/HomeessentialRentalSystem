import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Info, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const isAvailable = product.available !== undefined ? product.available : true;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-200 flex flex-col"
    >
      {/* Product Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
        <Link to={`/product/${product._id || product.id}`} className="block h-full w-full">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${
            isAvailable 
              ? 'bg-emerald-500 text-white' 
              : 'bg-slate-200 text-slate-600'
          }`}>
            {isAvailable ? 'In Stock' : 'Reserved'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
           <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest px-2 py-0.5 bg-indigo-50 rounded">
            {product.category}
          </span>
          <div className="flex items-center gap-1 ml-auto">
            <Star size={10} className="text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-bold text-slate-500">4.8</span>
          </div>
        </div>

        <Link to={`/product/${product._id || product.id}`}>
          <h3 className="font-bold text-slate-800 mb-4 line-clamp-1 hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase leading-none mb-1">Per Day</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                ₹{product.pricePerDay || product.price}
              </span>
            </div>
          </div>
          
          <Link 
            to={`/product/${product._id || product.id}`}
            className="p-2.5 bg-slate-50 text-slate-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-200"
          >
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
