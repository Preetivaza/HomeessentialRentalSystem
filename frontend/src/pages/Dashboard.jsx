import { Package, Clock, CheckCircle, TrendingUp, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { productService } from '../services/productService'

export default function Dashboard() {
  const { user } = useAuth()
  
  // Admin form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'furniture',
    image: '',
    monthlyRate: '',
    dailyRate: '',
    weeklyRate: '',
    deposit: '',
    stock: '1'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const handleAdminSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ text: '', type: '' })
    try {
      const payload = {
        ...formData,
        images: [formData.image],
        monthlyRate: Number(formData.monthlyRate),
        dailyRate: Number(formData.dailyRate) || 0,
        weeklyRate: Number(formData.weeklyRate) || 0,
        deposit: Number(formData.deposit) || 0,
        stock: Number(formData.stock) || 1
      }
      
      await productService.createProduct(payload)
      setMessage({ text: 'Product added successfully!', type: 'success' })
      setFormData({ name: '', description: '', category: 'furniture', image: '', monthlyRate: '', dailyRate: '', weeklyRate: '', deposit: '', stock: '1' })
    } catch (error) {
      setMessage({ text: 'Failed to add product', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const stats = [
    { label: 'Active Rentals', value: '3', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Orders', value: '1', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Completed', value: '12', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Savings', value: '₹24,500', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
  ]

  const activeRentals = [
    {
      id: 1,
      name: 'Modern Sofa Set',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
      startDate: '2025-01-01',
      endDate: '2025-07-01',
      monthlyPrice: 299,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Washing Machine',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400',
      startDate: '2025-02-15',
      endDate: '2026-02-15',
      monthlyPrice: 149,
      status: 'Active'
    },
    {
      id: 3,
      name: 'King Size Bed',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
      startDate: '2024-12-01',
      endDate: '2025-06-01',
      monthlyPrice: 249,
      status: 'Active'
    }
  ]

  const recentOrders = [
    { id: 1, name: 'Refrigerator', date: '2025-12-20', status: 'Pending', total: 179 },
    { id: 2, name: 'LED TV 43"', date: '2025-12-15', status: 'Delivered', total: 199 },
    { id: 3, name: 'Office Desk', date: '2025-12-10', status: 'Delivered', total: 129 },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Delivered':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your rentals and orders</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {user?.role === 'admin' && (
          <div className="card p-6 mb-8 border-2 border-indigo-100 bg-indigo-50/30">
            <div className="flex items-center gap-3 mb-6">
              <PlusCircle className="text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">Admin: Quick Add Product</h2>
            </div>
            
            {message.text && (
              <div className={`p-4 mb-6 rounded-lg font-medium text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Product Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-business" placeholder="e.g. Modern Sofa" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="input-business">
                  <option value="furniture">Furniture</option>
                  <option value="appliances">Appliances</option>
                  <option value="electronics">Electronics</option>
                  <option value="fitness">Fitness</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Image URL</label>
                <input required type="url" name="image" value={formData.image} onChange={handleInputChange} className="input-business" placeholder="https://unsplash.com/..." />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} className="input-business" rows="3" placeholder="Describe the item..."></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Monthly Rate (₹)</label>
                <input required type="number" name="monthlyRate" value={formData.monthlyRate} onChange={handleInputChange} className="input-business" min="0" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Stock Quantity</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="input-business" min="1" />
              </div>
              
              <div className="md:col-span-2 pt-4">
                <button type="submit" disabled={isSubmitting} className="btn-premium w-full">
                  {isSubmitting ? 'Uploading to Database...' : 'Add Product to Catalog'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Rentals */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Active Rentals</h2>
              <div className="space-y-4">
                {activeRentals.map(rental => (
                  <div key={rental.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex gap-4">
                      <img
                        src={rental.image}
                        alt={rental.name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{rental.name}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}>
                            {rental.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{rental.monthlyPrice}/mo
                          </span>
                          <div className="flex gap-2">
                            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                              Extend
                            </button>
                            <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div key={order.id} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{order.name}</h4>
                        <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">₹{order.total}/mo</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center text-primary-600 hover:text-primary-700 font-medium text-sm">
                View All Orders
              </button>
            </div>

            {/* Quick Actions */}
            <div className="card p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-medium text-gray-900">
                  Browse Products
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-medium text-gray-900">
                  Payment History
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-medium text-gray-900">
                  Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
