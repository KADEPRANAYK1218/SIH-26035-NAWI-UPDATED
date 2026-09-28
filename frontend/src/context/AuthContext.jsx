import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const isSessionActive = () => {
    try {
      return sessionStorage.getItem('nawi_session_active') === 'true';
    } catch {
      return false;
    }
  };

  const [user, setUser] = useState(() => {
    return isSessionActive() ? authService.getCurrentUser() : null;
  });
  const [token, setToken] = useState(() => {
    return isSessionActive() ? authService.getToken() : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function verifyUser() {
      if (token && isSessionActive()) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('nawi_user', JSON.stringify(res.data));
          }
        } catch {
          try { sessionStorage.removeItem('nawi_session_active'); } catch {}
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    }
    verifyUser();
  }, [token]);

  const login = async (email, password, role) => {
    const res = await authService.login(email, password, role);
    if (res.success && res.data) {
      try { sessionStorage.setItem('nawi_session_active', 'true'); } catch {}
      setUser(res.data.user);
      setToken(res.data.token);
    }
    return res;
  };

  const register = async (userData, autoLogin = true) => {
    const res = await authService.register(userData);
    if (res.success && autoLogin) {
      return login(userData.email, userData.password, userData.role);
    }
    return res;
  };

  const logout = () => {
    try { sessionStorage.removeItem('nawi_session_active'); } catch {}
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const hasRole = (allowedRoles = []) => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    return allowedRoles.includes(user.role);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    hasRole,
    isAdmin: user?.role === 'ADMIN',
    isEngineer: user?.role === 'TEST_ENGINEER' || user?.role === 'ADMIN',
    isReviewer: user?.role === 'REVIEWER' || user?.role === 'ADMIN',
    isOfficer: user?.role === 'LABORATORY_OFFICER' || user?.role === 'ADMIN',
    isViewer: user?.role === 'VIEWER'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
