import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import PageLoader from '../components/shared/PageLoader'

// ── Lazy imports ─────────────────────────────────────────────────
const Landing       = lazy(() => import('../pages/Landing'))
const Login         = lazy(() => import('../pages/Login'))
const Register      = lazy(() => import('../pages/Register'))
const TrackPublic   = lazy(() => import('../pages/Track'))
const Blog          = lazy(() => import('../pages/Blog'))
const BlogPost      = lazy(() => import('../pages/BlogPost'))
const CmsPage       = lazy(() => import('../pages/CmsPage'))
const NotFound      = lazy(() => import('../pages/NotFound'))

// Dashboard
const DashboardLayout = lazy(() => import('../components/dashboard/DashboardLayout'))
const DashboardHome   = lazy(() => import('../pages/dashboard/DashboardHome'))
const MyShipments     = lazy(() => import('../pages/dashboard/MyShipments'))
const BookShipment    = lazy(() => import('../pages/dashboard/BookShipment'))
const TrackShipment   = lazy(() => import('../pages/dashboard/TrackShipment'))
const Wallet          = lazy(() => import('../pages/dashboard/Wallet'))
const KycVerification = lazy(() => import('../pages/dashboard/KycVerification'))
const AddressBook     = lazy(() => import('../pages/dashboard/AddressBook'))
const Profile         = lazy(() => import('../pages/dashboard/Profile'))

// Admin
const AdminLayout      = lazy(() => import('../pages/admin/AdminLayout'))
const AdminDashboard   = lazy(() => import('../pages/admin/AdminDashboard'))
const KycManagement    = lazy(() => import('../pages/admin/KycManagement'))
const AllShipments     = lazy(() => import('../pages/admin/AllShipments'))
const CmsManager       = lazy(() => import('../pages/admin/CmsManager'))
const ManualOrders     = lazy(() => import('../pages/admin/ManualOrders'))
const PlatformSettings = lazy(() => import('../pages/admin/PlatformSettings'))

// ── Guards ────────────────────────────────────────────────────────
function ProtectedRoute() {
  const { token, isHydrated } = useAuthStore()
  if (!isHydrated) return <PageLoader />
  if (!token)      return <Navigate to="/login" replace />
  return <Suspense fallback={<PageLoader />}><Outlet /></Suspense>
}

function AdminRoute() {
  const { token, user, isHydrated } = useAuthStore()
  if (!isHydrated)     return <PageLoader />
  if (!token)          return <Navigate to="/login"    replace />
  if (!user?.is_admin) return <Navigate to="/dashboard" replace />
  return <Suspense fallback={<PageLoader />}><Outlet /></Suspense>
}

function GuestRoute() {
  const { token, isHydrated } = useAuthStore()
  if (!isHydrated) return <PageLoader />
  if (token)       return <Navigate to="/dashboard" replace />
  return <Suspense fallback={<PageLoader />}><Outlet /></Suspense>
}

// ── Router ────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Suspense fallback={<PageLoader />}><Outlet /></Suspense>,
    children: [
      // Public
      { index: true,        element: <Landing /> },
      { path: 'track',      element: <TrackPublic /> },
      { path: 'blog',       element: <Blog /> },
      { path: 'blog/:slug', element: <BlogPost /> },
      { path: 'p/:slug',    element: <CmsPage /> },

      // Guest only
      {
        element: <GuestRoute />,
        children: [
          { path: 'login',    element: <Login /> },
          { path: 'register', element: <Register /> },
        ],
      },

      // Protected — user dashboard
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard',
            element: <DashboardLayout />,
            children: [
              { index: true,       element: <DashboardHome /> },
              { path: 'shipments', element: <MyShipments /> },
              { path: 'book',      element: <BookShipment /> },
              { path: 'track',     element: <TrackShipment /> },
              { path: 'wallet',    element: <Wallet /> },
              { path: 'kyc',       element: <KycVerification /> },
              { path: 'addresses', element: <AddressBook /> },
              { path: 'profile',   element: <Profile /> },
            ],
          },
        ],
      },

      // Protected — admin
      {
        element: <AdminRoute />,
        children: [
          {
            path: 'admin',
            element: <AdminLayout />,
            children: [
              { index: true,          element: <AdminDashboard /> },
              { path: 'kyc',          element: <KycManagement /> },
              { path: 'shipments',    element: <AllShipments /> },
              { path: 'manual-orders',element: <ManualOrders /> },
              { path: 'cms',          element: <CmsManager /> },
              { path: 'platforms',    element: <PlatformSettings /> },
            ],
          },
        ],
      },

      // 404
      { path: '*', element: <NotFound /> },
    ],
  },
])