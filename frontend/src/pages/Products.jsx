import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { Filter, X, LayoutGrid, SlidersHorizontal, PackageSearch } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { products, isLoading: loading } = useProducts({ limit: 50 });

  const categories = ['All', 'Furniture', 'Appliances', 'Electronics', 'Kitchen'];

  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === 'All' || 
      (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());
    const priceMatch = (product.pricePerDay || 0) >= priceRange[0] && (product.pricePerDay || 0) <= priceRange[1];
    return categoryMatch && priceMatch;
  });

  const FilterSidebar = ({ isMobile = false }) => (
    <div className={`glass-card p-8 ${isMobile ? 'h-full border-none rounded-none' : 'sticky top-28'}`}>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="text-indigo-600" size={20} />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Refine</h2>
        </div>
        {isMobile && (
          <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-slate-100 rounded-xl">
             <X size={20} />
          </button>
        )}
      </div>

      <div className="mb-10">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Collections</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`w-full text-left px-5 py-3 rounded-xl font-bold transition-all ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* No Daily Budget filter as per request */}
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-20 mesh-bg">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-2">
            <span className="gradient-subtext">The Essentials Catalog</span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Browse <span className="text-indigo-600">Inventory.</span></h1>
            <p className="text-slate-500 font-medium">Discover premium furniture and appliances for your space.</p>
          </div>
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white/50 shadow-sm">
             <button onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100">
                <Filter size={18} />
                Filter
             </button>
             <div className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-400">
                <LayoutGrid size={20} />
                <span className="text-sm font-bold">Grid View</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id || product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-20 text-center flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-400 mb-6">
                    <PackageSearch size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">No Items Found</h3>
                  <p className="text-slate-500 font-medium mb-8 max-w-xs mx-auto">We couldn't find any items matching your current filters.</p>
                  <button
                    onClick={() => { setSelectedCategory('All'); setPriceRange([0, 500]); }}
                    className="btn-premium"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>

        {/* Mobile Filter Overlay */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileFilterOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden" 
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-full max-w-xs bg-white z-[70] lg:hidden shadow-2xl"
              >
                <FilterSidebar isMobile={true} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
