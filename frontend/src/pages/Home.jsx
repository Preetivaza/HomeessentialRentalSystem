import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Hero from '../components/Hero'
import { ArrowRight, Shield, Truck, Clock } from 'lucide-react'

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: 'Modern Sofa Set',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      price: 299,
      category: 'Furniture'
    },
    {
      id: 2,
      name: 'Dining Table',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800',
      price: 199,
      category: 'Furniture'
    },
    {
      id: 3,
      name: 'Washing Machine',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800',
      price: 149,
      category: 'Appliances'
    },
    {
      id: 4,
      name: 'King Size Bed',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
      price: 249,
      category: 'Furniture'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mb-4">
                <Truck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Delivery</h3>
              <p className="text-gray-600">
                Get your rentals delivered to your doorstep at no extra cost
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mb-4">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Plans</h3>
              <p className="text-gray-600">
                Choose rental periods that suit your lifestyle and budget
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                All products are verified and maintained to the highest standards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              View All
              <ArrowRight className="ml-1 w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their homes with our rental services.
          </p>
          <Link to="/products" className="btn-primary">
            Start Browsing
          </Link>
        </div>
      </section>
    </div>
  )
}
