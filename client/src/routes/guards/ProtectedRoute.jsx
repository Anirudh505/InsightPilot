import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute() {
  const { data: user, isLoading } = useCurrentUser();
  const token = localStorage.getItem('accessToken');

  // If there's absolutely no token, redirect immediately
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If we have a token but are still validating it with the server
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If the validation failed or no user is returned
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
