import { Navigate, Outlet } from 'react-router-dom';

/**
 * Ensures the user has the required role to access the nested routes.
 */
export function RoleGuard({ allowedRoles }) {
  // Mock logic. In reality, fetch from AuthContext.
  const userRole = 'project_manager'; 
  
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
