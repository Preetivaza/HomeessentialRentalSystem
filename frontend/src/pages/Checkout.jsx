import { useState } from 'react'
import { CreditCard, Wallet, Building } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { createOrder as createRazorpayOrder, verifyPayment } from "../services/paymentService"

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const { items, totals, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [discountCodeInput, setDiscountCodeInput] = useState('')
  const [appliedDiscountCode, setAppliedDiscountCode] = useState(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: ''
  })

  const grandTotal = totals.subtotal + totals.tax + (totals.deposit || 0);

  const applyDiscount = () => {
    const code = discountCodeInput.toUpperCase();
    if (code === 'WELCOME10') {
      setDiscountAmount(grandTotal * 0.10);
      setAppliedDiscountCode(code);
    } else if (code === 'SAVE500') {
      setDiscountAmount(Math.min(500, grandTotal));
      setAppliedDiscountCode(code);
    } else {
      setDiscountAmount(0);
      setAppliedDiscountCode(null);
      alert('Invalid or expired discount code');
    }
  }

  const orderSummary = {
    items: items.reduce((sum, x) => sum + (x.quantity || 0), 0),
    subtotal: totals.subtotal,
    tax: totals.tax,
    deposit: totals.deposit || 0,
    discount: discountAmount,
    total: Math.max(0, grandTotal - discountAmount)
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      const shippingAddress = {
        street: formData.street || 'Default Street',
        city: formData.city || 'Default City',
        state: formData.state || 'Default State',
        zipCode: formData.zipCode || '000000',
        country: 'India'
      };

      const orderPayload = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          startDate: item.startDate,
          endDate: item.endDate
        })),
        shippingAddress,
        discountCode: appliedDiscountCode
      };

      // 1. Create Order in backend
      const res = await api.post('/orders', orderPayload);
      const order = res.data.data.order;

      // 2. Create Razorpay order
      const token = localStorage.getItem('token');
      const rzpRes = await createRazorpayOrder(order._id, token);

      if (!rzpRes.success) {
        alert(rzpRes.message);
        setLoading(false);
        return;
      }

      const { orderId, amount } = rzpRes.data;

      // 3. Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        name: "Home Essentials Rental",
        description: "Order Payment",
        order_id: orderId,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        handler: async function (response) {
          try {
            // 4. Verify payment
            const verifyRes = await verifyPayment(
              {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
              token
            );

            if (verifyRes.success) {
              clearCart();
              navigate('/dashboard'); 
            } else {
              alert("Verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        alert("Payment failed: " + response.error.description);
      });

      rzp.open();

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong while placing the order");
    } finally {
      setLoading(false);
    }
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
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="input-field" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="input-field" placeholder="Doe" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field" placeholder="john.doe@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-field" placeholder="+91 98765 43210" />
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
                  <input type="text" name="street" value={formData.street} onChange={handleInputChange} className="input-field" placeholder="123 Main Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="input-field" placeholder="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="input-field" placeholder="Maharashtra" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code
                    </label>
                    <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="input-field" placeholder="400001" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landmark
                    </label>
                    <input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} className="input-field" placeholder="Near Park" />
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
                  <span className="font-medium text-gray-900">₹{orderSummary.tax.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="font-medium text-gray-900">₹{orderSummary.deposit.toFixed(2)}</span>
                </div>
                {orderSummary.discount > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-600">Discount ({appliedDiscountCode})</span>
                    <span className="font-medium text-green-600">-₹{orderSummary.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6 border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Have a Promo Code?
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="input-field mb-0 py-2 uppercase" 
                    placeholder="e.g. WELCOME10" 
                    value={discountCodeInput}
                    onChange={(e) => setDiscountCodeInput(e.target.value)}
                  />
                  <button 
                    onClick={applyDiscount}
                    className="px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium text-sm transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedDiscountCode && (
                  <p className="text-xs text-green-600 mt-2 font-medium">Code applied successfully!</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{orderSummary.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">/month</p>
                  </div>
                </div>
              </div>

              <button 
                className="btn-primary w-full py-3 mb-4" 
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order & Pay"}
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
