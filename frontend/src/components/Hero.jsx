import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6 lg:space-y-8">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Rent Home Essentials{' '}
              <span className="text-blue-600">Easily</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Experience affordable living without the commitment. Rent quality
              home essentials and furniture with flexible plans, fast delivery,
              and hassle-free returns.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Primary CTA */}
              <Link
                to="/products"
                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                Rent Now
              </Link>

              {/* Secondary CTA */}
              <Link
                to="/products"
                className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200 transform hover:scale-105 active:scale-95"
              >
                Browse Products
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 sm:gap-8 justify-center lg:justify-start pt-4">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 font-medium">Free Delivery</span>
              </div>

              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 font-medium">
                  Flexible Plans
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 font-medium">Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/hero-image.jpg"
                alt="Modern home essentials and furniture"
                className="w-full h-auto object-cover"
              />
              
              {/* Optional: Floating Badge */}
              <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg">
                <p className="text-sm font-semibold text-gray-900">
                  Starting at{' '}
                  <span className="text-blue-600 text-lg">₹199/mo</span>
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100 rounded-full -z-10 opacity-50"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-50 rounded-full -z-10 opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
