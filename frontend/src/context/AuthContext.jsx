import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('serveease_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (activeToken) => {
    if (!activeToken) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const { data } = await api.get('/profile');
      setUser(data);
      return data;
    } catch {
      localStorage.removeItem('serveease_token');
      setToken(null);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile(token);
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('serveease_token', data.token);
    setToken(data.token);
    const profile = await loadProfile(data.token);
    return profile || data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('serveease_token', data.token);
    setToken(data.token);
    const profile = await loadProfile(data.token);
    return profile || data;
  };

  const loginWithToken = async (oauthToken) => {
    localStorage.setItem('serveease_token', oauthToken);
    setToken(oauthToken);
    return await loadProfile(oauthToken);
  };

  const logout = () => {
    localStorage.removeItem('serveease_token');
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    return await loadProfile(localStorage.getItem('serveease_token'));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, loginWithToken, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function getHomeRouteForRole(role) {
  if (role === 'ADMIN') return '/admin/dashboard';
  if (role === 'PROVIDER') return '/provider/dashboard';
  if (role === 'CUSTOMER') return '/customer/dashboard';
  return '/';
}