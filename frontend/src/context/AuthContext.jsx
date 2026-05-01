// import { createContext, useContext, useState, useEffect } from 'react';
// import { authService } from '../services/authService';

// const AuthContext = createContext(null);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const readStoredAuth = () => {
//     const rawUser = localStorage.getItem('user');
//     const token = localStorage.getItem('token');
//     const parsedUser = rawUser ? JSON.parse(rawUser) : null;
//     return { token, user: parsedUser };
//   };

//   const persistAuth = ({ token, user }) => {
//     if (token) localStorage.setItem('token', token);
//     if (user) localStorage.setItem('user', JSON.stringify(user));
//   };

//   const clearAuth = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   };

//   useEffect(() => {
//     // Check if user is logged in on mount
//     try {
//       const { user: currentUser } = readStoredAuth();
//       setUser(currentUser);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//     }

//     const syncFromStorage = () => {
//       const { user: currentUser } = readStoredAuth();
//       setUser(currentUser);
//     };

//     const handleUnauthorized = () => {
//       clearAuth();
//       setUser(null);
//     };

//     window.addEventListener('storage', syncFromStorage);
//     window.addEventListener('auth:unauthorized', handleUnauthorized);
//     return () => {
//       window.removeEventListener('storage', syncFromStorage);
//       window.removeEventListener('auth:unauthorized', handleUnauthorized);
//     };
//   }, []);

//   const login = async (email, password) => {
//     const response = await authService.login(email, password);
//     persistAuth(response);
//     setUser(response.user);
//     return response;
//   };

  
//   const register = async (userData) => {
//     const response = await authService.register(userData);
//     persistAuth(response);
//     setUser(response.user);
//     return response;
//   };

//   const googleLogin = async (tokenId) => {
//     const response = await authService.googleLogin(tokenId);
//     persistAuth(response);
//     setUser(response.user);
//     return response;
//   };

//   const logout = () => {
//     clearAuth();
//     setUser(null);
//   };

//   const updateProfile = async (userData) => {
//     const response = await authService.updateProfile(userData);
//     if (response.user) {
//       localStorage.setItem('user', JSON.stringify(response.user));
//     }
//     setUser(response.user);
//     return response;
//   };

//   const value = {
//     user,
//     login,
//     register,
//     googleLogin,
//     updateProfile,
//     logout,
//     loading,
//     isAuthenticated: !!user
//   };

//   if (loading) {
//     return (
//       <AuthContext.Provider value={value}>
//         <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 mesh-bg">
//           <div className="relative">
//             <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-sm" />
//             </div>
//           </div>
//           <p className="mt-6 text-slate-500 font-bold tracking-widest uppercase text-xs animate-pulse">Initializing Identity</p>
//         </div>
//       </AuthContext.Provider>
//     );
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



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

  const readStoredAuth = () => {
    const rawUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const parsedUser = rawUser ? JSON.parse(rawUser) : null;
    return { token, user: parsedUser };
  };

  const persistAuth = ({ token, user }) => {
    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    try {
      const { user: currentUser } = readStoredAuth();
      setUser(currentUser);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }

    const syncFromStorage = () => {
      const { user: currentUser } = readStoredAuth();
      setUser(currentUser);
    };

    const handleUnauthorized = () => {
      clearAuth();
      setUser(null);
    };

    window.addEventListener('storage', syncFromStorage);
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

 
const login = async (email, password) => {
  const response = await authService.login(email, password);

  const token = response.token;
  const user = response.user;

  persistAuth({ token, user });
  setUser(user);

  return response;
};

  const register = async (userData) => {
  const response = await authService.register(userData);

  const token = response.token;
  const user = response.user;

  persistAuth({ token, user });
  setUser(user);

  return response;
};
  
 const googleLogin = async (tokenId) => {
  const response = await authService.googleLogin(tokenId);

  const token = response.token;
  const user = response.user;

  persistAuth({ token, user });
  setUser(user);

  return response;
};

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  const updateProfile = async (userData) => {
    const response = await authService.updateProfile(userData);

    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
    }

    return response;
  };

  const value = {
    user,
    login,
    register,
    googleLogin,
    updateProfile,
    logout,
    loading,
    isAuthenticated: !!user
  };

  if (loading) {
    return (
      <AuthContext.Provider value={value}>
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          <p className="mt-4 text-sm text-slate-500">Loading...</p>
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