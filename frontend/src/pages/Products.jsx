import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Filter, X } from 'lucide-react';

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories = ['All', 'Furniture', 'Appliances', 'Electronics', 'Kitchen'];

  const products = [
    {
      id: 1,
      name: 'Modern Sofa Set',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      price: 299,
      category: 'Furniture',
      available: true,
    },
    {
      id: 2,
      name: 'Dining Table',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800',
      price: 199,
      category: 'Furniture',
      available: true,
    },
    {
      id: 3,
      name: 'Washing Machine',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800',
      price: 149,
      category: 'Appliances',
      available: false,
    },
    {
      id: 4,
      name: 'King Size Bed',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
      price: 249,
      category: 'Furniture',
      available: true,
    },
    {
      id: 5,
      name: 'Refrigerator',
      image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800',
      price: 179,
      category: 'Appliances',
      available: true,
    },
    {
      id: 6,
      name: 'Office Desk',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
      price: 129,
      category: 'Furniture',
      available: true,
    },
    {
      id: 7,
      name: 'LED TV 43"',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
      price: 199,
      category: 'Electronics',
      available: true,
    },
    {
      id: 8,
      name: 'Microwave Oven',
      image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800',
      price: 89,
      category: 'Kitchen',
      available: true,
    },
  ];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  // Filter sidebar component
  const FilterSidebar = ({ isMobile = false }) => (
    <div
      className={`bg-white rounded-xl shadow-md p-6 ${
        isMobile ? 'h-full overflow-y-auto' : 'sticky top-20'
      }`}
    >
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <button
            onClick={() => setIsMobileFilterOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Category
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                if (isMobile) setIsMobileFilterOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Price Range (per day)
        </h3>
        <div className="space-y-4">
          {/* Price Display */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Min: ₹{priceRange[0]}</span>
            <span className="text-gray-600">Max: ₹{priceRange[1]}</span>
          </div>

          {/* Range Sliders */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Minimum Price
              </label>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value), priceRange[1]])
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Maximum Price
              </label>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => setPriceRange([0, 500])}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Reset Price
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Browse Products
          </h1>
          <p className="text-gray-600">
            Find the perfect home essentials for rent
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm w-full justify-center font-medium"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {filteredProducts.length}
            </span>
          </button>
        </div>

        {/* Main Layout */}
        <div className="flex gap-8">
          {/* Desktop Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing{' '}
                <span className="font-semibold text-gray-900">
                  {filteredProducts.length}
                </span>{' '}
                {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filter criteria
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setPriceRange([0, 500]);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>

        {/* Mobile Filter Overlay */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl">
              <FilterSidebar isMobile={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
