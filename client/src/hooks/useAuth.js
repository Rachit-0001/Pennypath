import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Convenience hook to access authentication state and actions
 * (user, login, logout, register, updateUser) from any component.
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
