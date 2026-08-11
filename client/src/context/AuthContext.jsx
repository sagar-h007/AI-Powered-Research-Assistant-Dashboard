import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Provide theme toggle capability
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    // Setup theme
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Keeping the context name as AuthContext to minimize import refactoring across components
  const value = {
    theme,
    setTheme,
    user: { name: 'Demo User', email: 'demo@omnisavant.ai' } // Mock user for UI purposes
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
