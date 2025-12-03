import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      try {
        console.log('[AuthContext] Checking authentication...');
        // Verify with backend that cookie is valid (don't trust localStorage alone)
        const response = await fetch('http://localhost:8080/auth/me', {
          method: 'GET',
          credentials: 'include', // Include cookies
        });

        console.log('[AuthContext] /auth/me response status:', response.status);

        if (response.ok) {
          const serverUserData = await response.json();
          console.log('[AuthContext] User authenticated:', serverUserData);
          // Update user data from server (more reliable)
          const updatedUserData = {
            email: serverUserData.email,
            id: serverUserData.id,
            role: serverUserData.role.toLowerCase(),
            firstName: serverUserData.firstName,
          };
          console.log('[AuthContext] Setting user:', updatedUserData);
          setUser(updatedUserData);
          setIsAuthenticated(true);
          console.log('[AuthContext] isAuthenticated set to true');
          authService.setAuth(updatedUserData);
        } else {
          console.log('[AuthContext] User not authenticated, clearing data');
          // Cookie invalid or expired, clear local data
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user_data');
          localStorage.removeItem('cinemaAuth');
          localStorage.removeItem('cinemaUser');
        }
      } catch (error) {
        console.error('[AuthContext] Auth check failed:', error);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user_data');
      } finally {
        console.log('[AuthContext] Auth check complete.');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    authService.setAuth(userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await authService.clearAuth();
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const isCustomer = () => {
    return user && user.role === 'customer';
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isAdmin: isAdmin(),
    isCustomer: isCustomer(),
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
