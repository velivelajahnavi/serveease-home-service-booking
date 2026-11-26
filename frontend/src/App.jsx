import { Navigate, Route, Routes, useLocation} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OAuth2CallbackPage from './pages/OAuth2CallbackPage';
import ProfilePage from './pages/ProfilePage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminProvidersPage from './pages/admin/AdminProvidersPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerServicesPage from './pages/customer/CustomerServicesPage';
import CustomerBookingsPage from './pages/customer/CustomerBookingsPage';

import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderServicesPage from './pages/provider/ProviderServicesPage';
import ProviderBookingsPage from './pages/provider/ProviderBookingsPage';

export default function App() {
  const location = useLocation();
  const hideLayout = ['/login', '/register', '/oauth2/callback'].includes(
    location.pathname
  );
  return (
    <div className="d-flex flex-column min-vh-100">

      {!hideLayout && <Navbar />}

      <main className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

          {/* Shared Authenticated Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'CUSTOMER', 'PROVIDER']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminCustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/providers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminProvidersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminReportsPage />
              </ProtectedRoute>
            }
          />

          {/* Customer Routes */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/services"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/bookings"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerBookingsPage />
              </ProtectedRoute>
            }
          />

          {/* Provider Routes */}
          <Route
            path="/provider/dashboard"
            element={
              <ProtectedRoute allowedRoles={['PROVIDER']}>
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/services"
            element={
              <ProtectedRoute allowedRoles={['PROVIDER']}>
                <ProviderServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/bookings"
            element={
              <ProtectedRoute allowedRoles={['PROVIDER']}>
                <ProviderBookingsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}  
    </div>
  );
}