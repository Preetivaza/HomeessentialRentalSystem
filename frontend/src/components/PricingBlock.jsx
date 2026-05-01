import { Shield, Truck } from 'lucide-react';

export default function PricingBlock({
  stock,
  startDate,
  endDate,
  quantity,
  onStartDateChange,
  onEndDateChange,
  onQuantityChange,
  onShowReceipt,
}) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="card p-6 sticky top-20 bg-white border border-gray-100 shadow-sm">
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
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">End Date</label>
            <input
              type="date"
              min={startDate}
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
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
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
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
            disabled={!stock || stock <= 0}
            onClick={() => onQuantityChange(Math.min(stock || 1, quantity + 1))}
            className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 font-semibold disabled:opacity-50"
          >
            +
          </button>
          <span className="text-xs text-gray-400 ml-2">
            {stock && stock > 0 ? `${stock} units left` : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8">
        <button 
          onClick={onShowReceipt}
          disabled={!stock || stock <= 0}
          className="w-full bg-primary-600 text-white rounded-xl py-4 font-bold text-lg hover:bg-primary-700 shadow-lg shadow-primary-600/30 transition-all active:scale-[0.98] mb-3 disabled:bg-gray-400 disabled:shadow-none"
        >
          {stock && stock > 0 ? 'Confirm Dates & View Bill' : 'Currently Unavailable'}
        </button>
        <div className="flex gap-4">
          <div className="flex items-center text-sm text-gray-500">
            <Shield className="w-4 h-4 mr-1 text-green-500" />
            Secure Payment
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Truck className="w-4 h-4 mr-1 text-primary-500" />
            Free Delivery
          </div>
        </div>
      </div>
    </div>
  );
}
