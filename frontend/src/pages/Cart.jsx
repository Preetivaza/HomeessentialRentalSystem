import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Modern Sofa Set',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
      pricePerDay: 299,
      quantity: 1,
      rentalDays: 30,
      category: 'Furniture',
    },
    {
      id: 2,
      name: 'Washing Machine',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400',
      pricePerDay: 149,
      quantity: 1,
      rentalDays: 60,
      category: 'Appliances',
    },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const updateRentalDays = (id, days) => {
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, rentalDays: days } : item))
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.pricePerDay * item.rentalDays * item.quantity,
    0
  );
  const deliveryFee = 0; // Free delivery
  const tax = subtotal * 0.18;
  const total = subtotal + tax + deliveryFee;

  // Rental duration options
  const rentalOptions = [
    { days: 30, label: '1 Month' },
    { days: 60, label: '2 Months' },
    { days: 90, label: '3 Months' },
    { days: 180, label: '6 Months' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-6">
        {/* Page Header */}
        <div className="mb-8 px-4 sm:px-0">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-xl shadow-md p-12 text-center mx-4 sm:mx-0">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Add some products to get started renting
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <Link
                      to={`/product/${item.id}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full sm:w-32 h-32 rounded-lg object-cover hover:opacity-90 transition-opacity"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Link to={`/product/${item.id}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                            {item.category}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Rental Duration Selector */}
                      <div className="mb-4">
                        <label className="text-xs text-gray-600 font-medium mb-2 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Rental Duration
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {rentalOptions.map((option) => (
                            <button
                              key={option.days}
                              onClick={() =>
                                updateRentalDays(item.id, option.days)
                              }
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                item.rentalDays === option.days
                                  ? 'bg-blue-600 text-white shadow-md'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-600 font-medium">
                            Quantity:
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            ₹{item.pricePerDay * item.rentalDays * item.quantity}
                          </p>
                          <p className="text-xs text-gray-500">
                            ₹{item.pricePerDay}/day × {item.rentalDays} days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Rental Duration Summary */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">
                    Rental Period Summary
                  </h3>
                  <div className="space-y-1">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="text-xs text-blue-800 flex justify-between"
                      >
                        <span className="truncate mr-2">{item.name}</span>
                        <span className="font-medium whitespace-nowrap">
                          {item.rentalDays} days
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18% GST)</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Amount
                    </span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="w-full block text-center px-6 py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg mb-3"
                >
                  Proceed to Checkout
                </Link>

                {/* Continue Shopping Link */}
                <Link
                  to="/products"
                  className="block text-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
