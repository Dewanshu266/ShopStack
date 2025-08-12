import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (storedToken && user) {
      setIsAuthenticated(true);
      setToken(storedToken);
      try {
        const userObj = JSON.parse(user);
        setIsAdmin(userObj?.roles?.includes('ADMIN') || false);
      } catch {
        setIsAdmin(false);
      }
    }
  }, []);

  const login = async (credentials) => {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setToken(data.token);
        setIsAdmin(data.user?.roles?.includes('ADMIN') || false);
      } else {
        throw new Error('Login succeeded but no token/user returned.');
      }
    } else {
      let errorMsg = 'Login failed';
      try {
        const err = await response.json();
        errorMsg = err.error || errorMsg;
      } catch {
        try {
          const errText = await response.text();
          errorMsg = errText || errorMsg;
        } catch {}
      }
      throw new Error(errorMsg);
    }
  };

  const register = async (userData) => {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setToken(data.token);
        setIsAdmin(data.user?.roles?.includes('ADMIN') || false);
      } else {
        throw new Error('Registration succeeded but no token/user returned.');
      }
    } else {
      let errorMsg = 'Registration failed';
      try {
        const err = await response.json();
        errorMsg = err.error || errorMsg;
      } catch {
        try {
          const errText = await response.text();
          errorMsg = errText || errorMsg;
        } catch {}
      }
      throw new Error(errorMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
