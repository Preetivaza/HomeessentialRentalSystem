import { Star } from 'lucide-react';

export default function ProductInfo({ product }) {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="ml-1 font-semibold">{product.ratings?.average || 4.5}</span>
        </div>
        <span className="text-gray-400">•</span>
        <span className="text-gray-600">{product.ratings?.count || 128} reviews</span>
      </div>
      
      <div className="border-t border-gray-200 pt-6 mt-6">
        <p className="text-gray-700 leading-relaxed">
          {product.description}
        </p>
      </div>
    </div>
  );
}
