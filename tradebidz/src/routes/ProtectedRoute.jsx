import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// This component checks if user has permission to access the route
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Not logged in -> redirect to login, save current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires specific roles and user doesn't have them -> Error page for no permission
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />; // Error page for no permission
  }

  return <Outlet />;
};

export default ProtectedRoute;