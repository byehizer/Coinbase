import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth() {
  const { User, logout } = useAuth();
  const location = useLocation();

  if (!User || User.role !== 'admin') {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
