import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from './Loader';

/**
 * Wraps private routes. Redirects unauthenticated users to /login
 * while the initial auth check (token verification) is shown as a loader.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader fullScreen />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
