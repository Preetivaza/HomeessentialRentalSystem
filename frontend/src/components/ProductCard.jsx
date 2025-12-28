import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  // Default availability to true if not specified
  const isAvailable = product.available !== undefined ? product.available : true;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              Available
            </span>
          ) : (
            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              Out of Stock
            </span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.category}
        </p>

        {/* Product Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ₹{product.price}
          </span>
          <span className="text-sm text-gray-500">/day</span>
        </div>

        {/* Rent Now Button */}
        <Link
          to={`/product/${product.id}`}
          className={`block w-full text-center px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            isAvailable
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          onClick={(e) => !isAvailable && e.preventDefault()}
        >
          {isAvailable ? 'Rent Now' : 'Unavailable'}
        </Link>
      </div>
    </div>
  );
}
