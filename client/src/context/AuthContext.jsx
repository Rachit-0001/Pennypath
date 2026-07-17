import { createContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // initial auth check

  // On first load, if a token exists, verify it and load the user profile.
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('pennypath_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user: fetchedUser } = await authService.getMe();
        setUser(fetchedUser);
      } catch (err) {
        localStorage.removeItem('pennypath_token');
        localStorage.removeItem('pennypath_user');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem('pennypath_token', data.token);
    localStorage.setItem('pennypath_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    localStorage.setItem('pennypath_token', data.token);
    localStorage.setItem('pennypath_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pennypath_token');
    localStorage.removeItem('pennypath_user');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('pennypath_user', JSON.stringify(next));
      return next;
    });
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
