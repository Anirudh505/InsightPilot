import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { RoleGuard } from './guards/RoleGuard';

// Lazy load layouts and pages
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const AuthLayout = lazy(() => import('../layouts/AuthLayout'));
const DashboardOverview = lazy(() => import('../pages/DashboardOverview'));
const AnalyticsWorkspace = lazy(() => import('../pages/AnalyticsWorkspace'));
const JourneyExplorer = lazy(() => import('../pages/JourneyExplorer'));
const FunnelWorkspace = lazy(() => import('../pages/FunnelWorkspace'));
const RetentionWorkspace = lazy(() => import('../pages/RetentionWorkspace'));
const FeatureAdoptionWorkspace = lazy(() => import('../pages/FeatureAdoptionWorkspace'));
const AICopilotWorkspace = lazy(() => import('../pages/AICopilotWorkspace'));

// Fallback loader for suspense
const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Define router structure
const router = createBrowserRouter([
  {
    path: '/',
    // Public routes (Auth)
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/workspace/ws_1/project/proj_1" replace />,
      },
      {
        path: 'login',
        element: <Navigate to="/workspace/ws_1/project/proj_1" replace />,
      },
      {
        path: 'register',
        element: <div>Register Page Placeholder</div>,
      }
    ],
  },
  {
    // Protected Application Routes
    element: <ProtectedRoute />,
    children: [
      {
        path: '/workspace/:workspaceId/project/:projectId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <DashboardOverview />
              </Suspense>
            ),
          },
          {
            path: 'analytics',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AnalyticsWorkspace />
              </Suspense>
            ),
          },
          {
            path: 'analytics/journeys',
            element: (
              <Suspense fallback={<PageLoader />}>
                <JourneyExplorer />
              </Suspense>
            ),
          },
          {
            path: 'analytics/funnels',
            element: (
              <Suspense fallback={<PageLoader />}>
                <FunnelWorkspace />
              </Suspense>
            ),
          },
          {
            path: 'analytics/retention',
            element: (
              <Suspense fallback={<PageLoader />}>
                <RetentionWorkspace />
              </Suspense>
            ),
          },
          {
            path: 'analytics/features',
            element: (
              <Suspense fallback={<PageLoader />}>
                <FeatureAdoptionWorkspace />
              </Suspense>
            ),
          },
          {
            path: 'copilot',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AICopilotWorkspace />
              </Suspense>
            ),
          },
          {
            path: 'settings',
            element: (
              <RoleGuard allowedRoles={['project_manager', 'admin']} />
            ),
            children: [
              {
                index: true,
                element: <div>Settings Placeholder</div>,
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <div>404 Not Found</div>
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
