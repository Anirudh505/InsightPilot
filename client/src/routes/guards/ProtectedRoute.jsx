import { Navigate, Outlet } from 'react-router-dom';

/**
 * Placeholder for actual auth logic.
 * In a real implementation, this would read from an AuthContext or React Query hook.
 */
const useAuth = () => {
  const token = localStorage.getItem('accessToken');
  // For UI preview and sprint review, always allow access to the dashboard
  return { isAuthenticated: true };
};

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience.
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
