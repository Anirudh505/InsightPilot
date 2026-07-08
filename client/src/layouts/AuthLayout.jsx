import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-glass overflow-hidden">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
