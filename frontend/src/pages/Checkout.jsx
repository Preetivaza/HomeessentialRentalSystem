import { useState } from 'react'
import { CreditCard, Wallet, Building } from 'lucide-react'

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState('card')

  const orderSummary = {
    items: 2,
    subtotal: 448,
    tax: 80.64,
    total: 528.64
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input type="text" className="input-field" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input type="text" className="input-field" placeholder="Doe" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input type="email" className="input-field" placeholder="john.doe@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input type="tel" className="input-field" placeholder="+91 98765 43210" />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input type="text" className="input-field" placeholder="123 Main Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input type="text" className="input-field" placeholder="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input type="text" className="input-field" placeholder="Maharashtra" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code
                    </label>
                    <input type="text" className="input-field" placeholder="400001" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landmark
                    </label>
                    <input type="text" className="input-field" placeholder="Near Park" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="space-y-3 mb-6">
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <CreditCard className="w-5 h-5 ml-3 mr-2 text-gray-600" />
                  <span className="font-medium text-gray-900">Credit/Debit Card</span>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'upi' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <Wallet className="w-5 h-5 ml-3 mr-2 text-gray-600" />
                  <span className="font-medium text-gray-900">UPI</span>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'netbanking' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <Building className="w-5 h-5 ml-3 mr-2 text-gray-600" />
                  <span className="font-medium text-gray-900">Net Banking</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input type="text" className="input-field" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input type="text" className="input-field" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input type="text" className="input-field" placeholder="123" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input type="text" className="input-field" placeholder="JOHN DOE" />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID
                  </label>
                  <input type="text" className="input-field" placeholder="yourname@upi" />
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Bank
                  </label>
                  <select className="input-field">
                    <option>Select your bank</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Items ({orderSummary.items})</span>
                  <span className="font-medium text-gray-900">₹{orderSummary.subtotal}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-medium text-gray-900">₹{orderSummary.tax}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{orderSummary.total}
                    </p>
                    <p className="text-sm text-gray-500">/month</p>
                  </div>
                </div>
              </div>

              <button className="btn-primary w-full py-3 mb-4">
                Place Order
              </button>

              <div className="text-xs text-gray-500 text-center">
                By placing this order, you agree to our{' '}
                <a href="#" className="text-primary-600 hover:underline">Terms & Conditions</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
