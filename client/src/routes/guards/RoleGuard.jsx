import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * Ensures the user has the required role to access the nested routes.
 */
export function RoleGuard({ allowedRoles }) {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // Fallback to project_manager or member if user.role is missing depending on DB schema
  const userRole = user?.role || 'member'; 
  
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
