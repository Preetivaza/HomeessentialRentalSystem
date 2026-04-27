import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Shield, Truck, Calendar, X, Receipt, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { productService } from '../services/productService'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(tomorrow)
  const [quantity, setQuantity] = useState(1)
  const [showReceipt, setShowReceipt] = useState(false)

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
    pricePerDay: 15,
    securityDeposit: 150,
    lateFeePerDay: 5
  }

  const [selectedImage, setSelectedImage] = useState(0)
  const [calculation, setCalculation] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Sync with Backend Pricing Engine
  useEffect(() => {
    const fetchCalculation = async () => {
      setIsCalculating(true);
      try {
        // Try real backend call if ID is valid, else fallback to mock math for UI development
        let result = null;
        if (id && id.length > 5) {
          result = await productService.calculateCost(id, { startDate, endDate, quantity });
        } else {
          // Mock math for static UI
          await new Promise(r => setTimeout(r, 600)); // fake delay
          const start = new Date(startDate);
          start.setHours(0,0,0,0);
          const end = new Date(endDate);
          end.setHours(0,0,0,0);
          const durationRaw = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
          
          const duration = Math.max(durationRaw, product.minRentalDays || 1);
          const baseRent = product.pricePerDay * duration * quantity;
          const deposit = product.securityDeposit * quantity;
          const tax = baseRent * 0.18;
          result = { duration, baseRent, deposit, tax, delivery: 0, total: baseRent + deposit + tax };
        }
        setCalculation(result);
      } catch (error) {
        console.error("Calculation Error:", error);
      } finally {
        setIsCalculating(false);
      }
    };

    fetchCalculation();
  }, [id, startDate, endDate, quantity]);

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

              {/* Rental Dates */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Rental Period
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      min={today}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input
                      type="date"
                      min={startDate}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
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
                  <span className="text-gray-600">Base Rent</span>
                  <div>
                    {isCalculating || !calculation ? (
                      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-gray-900">
                          ₹{calculation?.baseRent}
                        </span>
                        <span className="text-gray-500 ml-1">for {calculation?.duration} days</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button className="btn-primary w-full py-3">
                  Add to Cart
                </button>
                <button 
                  onClick={() => setShowReceipt(true)}
                  className="btn-secondary w-full py-3"
                >
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

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Rental Bill Calculation</h2>
                    <p className="text-sm text-gray-500">Review your payment details</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowReceipt(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">Dates: {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()} • Qty: {quantity}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  {isCalculating || !calculation ? (
                     <div className="flex justify-center p-4">
                       <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                     </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-gray-600">
                        <span>Base Rent (₹{product.pricePerDay} × {calculation.duration} Days × {quantity})</span>
                        <span className="font-medium text-gray-900">₹{calculation.baseRent}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Security Deposit (Refundable)</span>
                        <span className="font-medium text-gray-900">₹{calculation.deposit}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>GST (18% on Rent)</span>
                        <span className="font-medium text-gray-900">₹{calculation.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery & Installation</span>
                        <span className="font-medium text-green-600">Free</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-end p-4 mt-4 bg-primary-50 rounded-xl border border-primary-100">
                    <div>
                      <p className="font-bold text-primary-900">Total Payable Today</p>
                      <p className="text-xs text-primary-700 mt-0.5">Rent + Deposit + Taxes</p>
                    </div>
                    <span className="text-2xl font-bold text-primary-700">
                      ₹{calculation?.total.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Important Disclaimers */}
                  <div className="mt-4 space-y-1 text-xs text-gray-400">
                    <p>• Deposit refundable after inspection</p>
                    <p>• Late fee applies after due date</p>
                    <p>• Damage charges extra</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                <button 
                  onClick={() => setShowReceipt(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-sm shadow-primary-600/30 transition-all active:scale-[0.98]"
                >
                  Proceed to Checkout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
