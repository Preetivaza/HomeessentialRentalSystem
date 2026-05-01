import { motion } from 'framer-motion';
import { X, Receipt, Loader2 } from 'lucide-react';

export default function ReceiptModal({ 
  showReceipt, 
  setShowReceipt, 
  product, 
  startDate, 
  endDate, 
  quantity, 
  calculation, 
  isCalculating,
  onProceed
}) {
  if (!showReceipt || !product) return null;

  return (
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
            <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
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
                  <span className="font-medium text-gray-900">₹{parseFloat(calculation.tax).toFixed(2)}</span>
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
                ₹{calculation?.total?.toFixed(2) || '0.00'}
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
            disabled={isCalculating || !calculation}
            onClick={onProceed}
            className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium shadow-sm shadow-primary-600/30 transition-all active:scale-[0.98]"
          >
            Proceed to Checkout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
