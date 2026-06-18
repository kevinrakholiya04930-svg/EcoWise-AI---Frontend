import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMe, login as apiLogin, register as apiRegister, onboarding as apiOnboarding } from '../api/auth.api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = async () => {
    const res = await getMe();
    setUser(res.data);
    return res.data;
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          await loadCurrentUser();
        } catch (err) {
          console.error('Failed to load user', err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await apiLogin(email, password);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      const currentUser = await loadCurrentUser();
      setLoading(false);
      return currentUser;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await apiRegister(name, email, password);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      const currentUser = await loadCurrentUser();
      setLoading(false);
      return currentUser;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const completeOnboarding = async (profileData) => {
    try {
      await apiOnboarding(profileData);
      return await loadCurrentUser();
    } catch (err) {
      throw err;
    }
  };

  const refreshUser = async () => {
    try {
      await loadCurrentUser();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, completeOnboarding, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
