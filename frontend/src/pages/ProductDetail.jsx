import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, Shield, Truck, Calendar } from 'lucide-react'
import { useState } from 'react'

export default function ProductDetail() {
  const { id } = useParams()
  const [selectedPlan, setSelectedPlan] = useState('6')
  const [quantity, setQuantity] = useState(1)

  const product = {
    id: 1,
    name: 'Modern Sofa Set',
    category: 'Furniture',
    rating: 4.5,
    reviews: 128,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200'
    ],
    description: 'Premium quality modern sofa set perfect for your living room. Features comfortable cushioning and durable fabric. Available in multiple colors.',
    features: [
      '3-seater comfortable sofa',
      'Premium fabric upholstery',
      'Sturdy wooden frame',
      'Easy to maintain',
      'Free assembly included'
    ],
    specifications: {
      'Dimensions': '180cm x 85cm x 75cm',
      'Material': 'Fabric & Wood',
      'Color': 'Gray',
      'Weight': '45 kg'
    },
    pricing: {
      '3': 399,
      '6': 299,
      '12': 249,
      '24': 199
    }
  }

  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/products" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div>
            <div className="card overflow-hidden mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`card overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-primary-600' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="card p-6 sticky top-20">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-semibold">{product.rating}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{product.reviews} reviews</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {product.description}
                </p>
              </div>

              {/* Rental Plans */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Rental Plan
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.pricing).map(([months, price]) => (
                    <button
                      key={months}
                      onClick={() => setSelectedPlan(months)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        selectedPlan === months
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm text-gray-600 mb-1">{months} Months</div>
                      <div className="text-xl font-bold">₹{price}/mo</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 font-semibold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    className="w-16 text-center border border-gray-300 rounded-lg py-2 font-semibold"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-600">Total Monthly Cost</span>
                  <div>
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{product.pricing[selectedPlan] * quantity}
                    </span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button className="btn-primary w-full py-3">
                  Add to Cart
                </button>
                <button className="btn-secondary w-full py-3">
                  Rent Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Shield className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Quality Assured</p>
                  </div>
                  <div>
                    <Truck className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Free Delivery</p>
                  </div>
                  <div>
                    <Calendar className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Flexible Plans</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="card p-6">
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              <button className="pb-3 border-b-2 border-primary-600 font-semibold text-primary-600">
                Features
              </button>
              <button className="pb-3 border-b-2 border-transparent font-semibold text-gray-500 hover:text-gray-700">
                Specifications
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Specifications</h3>
              <dl className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-600">{key}</dt>
                    <dd className="font-medium text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
