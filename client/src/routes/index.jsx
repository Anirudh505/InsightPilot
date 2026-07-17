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
const RealtimeWorkspace = lazy(() => import('../pages/RealtimeWorkspace'));
const CohortWorkspace = lazy(() => import('../pages/CohortWorkspace'));
const SegmentBuilder = lazy(() => import('../pages/SegmentBuilder'));
const ReportsWorkspace = lazy(() => import('../pages/ReportsWorkspace'));
const NotificationsWorkspace = lazy(() => import('../pages/NotificationsWorkspace'));
const AdminWorkspace = lazy(() => import('../pages/AdminWorkspace'));
const SettingsWorkspace = lazy(() => import('../pages/SettingsWorkspace'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));

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
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        ),
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
            path: 'analytics/realtime',
            element: (
              <Suspense fallback={<PageLoader />}>
                <RealtimeWorkspace />
              </Suspense>
            ),
          },
          {
            path: 'analytics/cohorts',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CohortWorkspace />
              </Suspense>
            ),
          },
          {
            path: 'analytics/segments',
            element: (
              <Suspense fallback={<PageLoader />}>
                <SegmentBuilder />
              </Suspense>
            ),
          },
          {
            path: 'reports',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ReportsWorkspace />
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
            path: 'notifications',
            element: (
              <Suspense fallback={<PageLoader />}>
                <NotificationsWorkspace />
              </Suspense>
            ),
          },
          {
            path: 'settings',
            element: (
              <Suspense fallback={<PageLoader />}>
                <SettingsWorkspace />
              </Suspense>
            ),
          },
          {
            path: 'admin',
            element: (
              <RoleGuard allowedRoles={['project_manager', 'admin']}>
                <Suspense fallback={<PageLoader />}>
                  <AdminWorkspace />
                </Suspense>
              </RoleGuard>
            ),
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
