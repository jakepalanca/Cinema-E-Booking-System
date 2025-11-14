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

  useEffect(() => {
    // Load user from localStorage on mount
    const userData = authService.getUser();
    if (userData && authService.isAuthenticated()) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    authService.setAuth(token, userData);
    setUser(userData);
  };

  const logout = () => {
    authService.clearAuth();
    setUser(null);
  };

  const isAuthenticated = () => {
    return authService.isAuthenticated() && user !== null;
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
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    isCustomer: isCustomer(),
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

