import { PlusCircle, Edit2, Save, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useProducts } from '../hooks/useProducts'
import { toast } from 'react-toastify'

export default function Dashboard() {
  const { user } = useAuth()
  
  // Dashboard Metrics State
  const { products, setProducts, isLoading: loading, refetch, createProduct, updateProduct } = useProducts({ limit: 50 })
  
  // Admin form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'furniture',
    image: '',
    pricePerDay: '',
    securityDeposit: '',
    lateFeePerDay: '5',
    stock: '1'
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  // Inline Editor State
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  // Add Product Handler
  const handleAdminSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ text: '', type: '' })
    try {
      const payload = {
        ...formData,
        images: [formData.image],
        pricePerDay: Number(formData.pricePerDay),
        securityDeposit: Number(formData.securityDeposit),
        lateFeePerDay: Number(formData.lateFeePerDay) || 0,
        stock: Number(formData.stock) || 1
      }
      
      await createProduct(payload)
      setMessage({ text: 'Product added successfully!', type: 'success' })
      setFormData({ name: '', description: '', category: 'furniture', image: '', pricePerDay: '', securityDeposit: '', lateFeePerDay: '5', stock: '1' })
    } catch (error) {
      setMessage({ text: error.response?.data?.error || 'Failed to add product', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Inline Editing Handlers
  const startEditing = (product) => {
    setEditingId(product._id)
    setEditForm({
      pricePerDay: product.pricePerDay,
      securityDeposit: product.securityDeposit,
      lateFeePerDay: product.lateFeePerDay || 0
    })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const saveProductEdit = async (id) => {
    try {
      const payload = {
        pricePerDay: Number(editForm.pricePerDay),
        securityDeposit: Number(editForm.securityDeposit),
        lateFeePerDay: Number(editForm.lateFeePerDay)
      }
      await updateProduct(id, payload)
      toast.success("Pricing updated successfully!")
      setEditingId(null)
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update API")
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your rentals and orders</p>
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

            <form onSubmit={handleAdminSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Image URL</label>
                <input required type="url" name="image" value={formData.image} onChange={handleInputChange} className="input-business" placeholder="https://unsplash.com/..." />
              </div>
              <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} className="input-business" rows="2" placeholder="Describe the item..."></textarea>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Price/Day (₹)</label>
                <input required type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleInputChange} className="input-business" min="0" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Security Deposit (₹)</label>
                <input required type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleInputChange} className="input-business" min="0" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Late Fee/Day (₹)</label>
                <input required type="number" name="lateFeePerDay" value={formData.lateFeePerDay} onChange={handleInputChange} className="input-business" min="0" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Initial Stock</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="input-business" min="1" />
              </div>
              
              <div className="md:col-span-2 flex items-end">
                <button type="submit" disabled={isSubmitting} className="btn-premium w-full h-10 mt-6">
                  {isSubmitting ? 'Uploading to Database...' : 'Add Product to Catalog'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inventory Manager (Replaced Active Rentals) */}
          <div className="lg:col-span-2">
            <div className="card p-6 border-2 border-indigo-50">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Catalogue</h2>
              {loading ? (
                <p className="text-slate-500 animate-pulse">Loading database items...</p>
              ) : (
                <div className="space-y-4">
                  {products.map(product => {
                    const isEditing = editingId === product._id;
                    return (
                      <div key={product._id} className={`border rounded-lg p-4 transition-all ${isEditing ? 'border-primary-500 bg-primary-50/10 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                        <div className="flex gap-4">
                          <img
                            src={product.images?.[0] || '/placeholder.png'}
                            alt={product.name}
                            className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                          />
                          <div className="flex-grow flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-600">
                                  {product.category}
                                </span>
                              </div>
                            </div>
                            
                            {isEditing ? (
                              <div className="flex gap-2 items-center mt-2 animate-in fade-in">
                                <div className="flex items-center gap-2 border rounded bg-white p-1">
                                  <span className="text-xs text-gray-400 font-bold ml-2">Rent/Day: ₹</span>
                                  <input type="number" name="pricePerDay" className="w-16 text-sm font-bold border-none p-1 focus:ring-0" value={editForm.pricePerDay} onChange={handleEditChange} />
                                </div>
                                <div className="flex items-center gap-2 border rounded bg-white p-1 hidden sm:flex">
                                  <span className="text-xs text-gray-400 font-bold ml-2">Deposit: ₹</span>
                                  <input type="number" name="securityDeposit" className="w-16 text-sm font-bold border-none p-1 focus:ring-0" value={editForm.securityDeposit} onChange={handleEditChange} />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm font-bold text-gray-900">
                                  ₹{product.pricePerDay}/day
                                </span>
                                <span className="text-xs text-gray-500 hidden sm:inline">
                                  Deposit: ₹{product.securityDeposit}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {product.stock} in stock
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Admin Action Buttons */}
                          {user?.role === 'admin' && (
                            <div className="flex flex-col justify-center border-l pl-4 border-gray-100 space-y-2">
                              {isEditing ? (
                                <>
                                  <button onClick={() => saveProductEdit(product._id)} className="p-1.5 bg-primary-600 text-white rounded hover:bg-primary-700 transition">
                                    <Save size={16} />
                                  </button>
                                  <button onClick={cancelEditing} className="p-1.5 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition">
                                    <X size={16} />
                                  </button>
                                </>
                              ) : (
                                <button onClick={() => startEditing(product)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition">
                                  <Edit2 size={16} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
              <p className="text-sm text-slate-500">
                Recent orders will appear here once order APIs are connected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
