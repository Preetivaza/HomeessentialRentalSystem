import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Package, ShoppingCart, LayoutGrid, LogOut, Menu, X, ChevronDown, UserCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { count } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationLinks = [
    { name: 'Products', path: '/products', icon: <Package size={18} /> },
    { name: 'Cart', path: '/cart', icon: <ShoppingCart size={18} /> },
  ];

  const filteredLinks = navigationLinks.filter(link => 
    !link.adminOnly || (user?.role === 'admin')
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-sm py-3 border-b border-slate-100' : 'bg-white/90 backdrop-blur-sm py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Home className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Home<span className="text-indigo-600">Essentials</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {filteredLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="px-4 py-2 rounded-lg font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200 flex items-center gap-2"
              >
                <span className="relative">
                  {link.icon}
                  {link.name === 'Cart' && count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-black rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </span>
                <span>{link.name}</span>
              </Link>
            ))}

            {isAuthenticated && user && (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200 flex items-center gap-2"
              >
                <LayoutGrid size={18} />
                <span>Dashboard</span>
              </Link>
            )}

            <div className="h-6 w-[1px] bg-slate-200 mx-3" />

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-2 overflow-hidden"
                    >
                      <div className="px-3 py-2 mb-1 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                      </div>
                      <div className="space-y-1">
                        <Link 
                          to="/profile" 
                          onClick={() => setShowUserMenu(false)}
                          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-indigo-50 text-slate-700 text-sm font-medium transition-all"
                        >
                          <UserCircle size={16} className="text-indigo-600" />
                          <span>My Profile</span>
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-rose-50 text-rose-600 text-sm font-medium transition-all">
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Sign In</Link>
                <Link to="/signup" className="btn-premium !py-2 !px-5 !text-sm">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t border-slate-100 shadow-xl overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {filteredLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-medium"
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-medium"
                  >
                    <UserCircle size={18} />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-rose-600 hover:bg-rose-50 transition-all font-medium"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 mt-4">
                   <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center p-3 rounded-lg border border-slate-200 font-semibold text-slate-600">Login</Link>
                   <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center p-3 rounded-lg bg-indigo-600 text-white font-semibold">Join Now</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
