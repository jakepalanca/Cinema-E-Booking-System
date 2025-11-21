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
        // First try to get user from localStorage
        const userData = authService.getUser();
        
        // Then verify with backend that cookie is valid
        const response = await fetch('http://localhost:8080/auth/me', {
          method: 'GET',
          credentials: 'include', // Include cookies
        });

        if (response.ok) {
          const serverUserData = await response.json();
          // Update user data from server (more reliable)
          const updatedUserData = {
            email: serverUserData.email,
            id: serverUserData.id,
            role: serverUserData.role.toLowerCase(),
            ...userData, // Keep any additional fields from localStorage
          };
          setUser(updatedUserData);
          setIsAuthenticated(true);
          authService.setAuth(updatedUserData);
        } else {
          // Cookie invalid or expired, clear local data
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user_data');
          localStorage.removeItem('cinemaAuth');
          localStorage.removeItem('cinemaUser');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
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

