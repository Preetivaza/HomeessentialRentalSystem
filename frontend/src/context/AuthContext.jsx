import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    try {
      console.log('AuthContext: Initializing...');
      const currentUser = authService.getCurrentUser();
      console.log('AuthContext: Current user:', currentUser);
      setUser(currentUser);
      setLoading(false);
      console.log('AuthContext: Loading complete');
    } catch (error) {
      console.error('AuthContext: Error initializing:', error);
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setUser(response.user);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  if (loading) {
    return (
      <AuthContext.Provider value={value}>
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 mesh-bg">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-sm" />
            </div>
          </div>
          <p className="mt-6 text-slate-500 font-bold tracking-widest uppercase text-xs animate-pulse">Initializing Identity</p>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
