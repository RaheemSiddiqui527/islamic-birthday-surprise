import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSession, loginAdmin, logoutAdmin } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await getSession();
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('kareem_admin_token');
    } finally {
      setLoading(false);
    }
  }

  async function login(username, password) {
    const res = await loginAdmin(username, password);
    if (res.data.success) {
      if (res.data.token) {
        localStorage.setItem('kareem_admin_token', res.data.token);
      }
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.error || 'Login failed');
  }

  async function logout() {
    try {
      await logoutAdmin();
    } catch (err) {
      console.warn('Logout error', err);
    } finally {
      localStorage.removeItem('kareem_admin_token');
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        refreshUser: checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
