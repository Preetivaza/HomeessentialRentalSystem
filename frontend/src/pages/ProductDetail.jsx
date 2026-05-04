import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import ReceiptModal from '../components/ReceiptModal'
import ImageGallery from '../components/ImageGallery'
import ProductInfo from '../components/ProductInfo'
import PricingBlock from '../components/PricingBlock'
import { useProduct } from '../hooks/useProduct'
import { useRentalCalculation } from '../hooks/useRentalCalculation'
import { useCart } from '../hooks/useCart'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // Phase 3.3 State Ownership
  const [showReceipt, setShowReceipt] = useState(false)
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const tomorrow = useMemo(() => new Date(Date.now() + 86400000).toISOString().split('T')[0], [])
  const [config, setConfig] = useState({ startDate: today, endDate: tomorrow, quantity: 1 })
  
  // Hooks (Phase 2)
  const { product, isLoading, error } = useProduct(id)
  const { calculation, isCalculating } = useRentalCalculation({ productId: id, ...config })
  const { addItem } = useCart()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <Link to="/products" className="text-primary-600 hover:underline">Return to collection</Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/products" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <ImageGallery images={product?.images} productName={product?.name} />

          <div>
            <ProductInfo product={product} />
            <PricingBlock 
              stock={product?.stock}
              startDate={config.startDate}
              endDate={config.endDate}
              quantity={config.quantity}
              onStartDateChange={(startDate) => setConfig((c) => ({ ...c, startDate }))}
              onEndDateChange={(endDate) => setConfig((c) => ({ ...c, endDate }))}
              onQuantityChange={(quantity) => setConfig((c) => ({ ...c, quantity }))}
              onShowReceipt={() => setShowReceipt(true)}
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="border-t border-gray-200 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
              <ul className="space-y-4">
                {product?.features?.length > 0 ? (
                  product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Star className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-sm">Standard quality and durability guaranteed.</p>
                )}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {product?.specifications && Object.keys(product.specifications).length > 0 ? (
                  Object.entries(product.specifications).map(([key, value], index) => (
                    <div 
                      key={key}
                      className={`flex px-6 py-4 ${
                        index !== Object.keys(product.specifications).length - 1 ? 'border-b border-gray-100' : ''
                      } ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <span className="w-1/3 font-medium text-gray-900 capitalize">{key}</span>
                      <span className="w-2/3 text-gray-600">{value}</span>
                    </div>
                  ))
                ) : (
                  <p className="p-6 text-gray-500 italic text-sm border-b border-gray-100 bg-gray-50">Dimensions and material details available on request.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReceiptModal 
        showReceipt={showReceipt}
        setShowReceipt={setShowReceipt}
        product={product}
        startDate={config.startDate}
        endDate={config.endDate}
        quantity={config.quantity}
        calculation={calculation}
        isCalculating={isCalculating}
        onProceed={() => {
          addItem(product, config)
          navigate('/checkout')
        }}
      />
    </div>
  )
}
