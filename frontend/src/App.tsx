import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import CreatorLayout from './components/CreatorLayout';
import Dashboard from './pages/Dashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import Campaigns from './pages/Campaigns';
import CreatorCampaigns from './pages/CreatorCampaigns';
import CreateCampaign from './pages/CreateCampaign';
import Creators from './pages/Creators';
import CreatorTasks from './pages/CreatorTasks';
import Assets from './pages/Assets';
import Analytics from './pages/Analytics';
import CreatorAnalytics from './pages/CreatorAnalytics';
import Payments from './pages/Payments';
import CreatorEarnings from './pages/CreatorEarnings';
import Settings from './pages/Settings';
import CreatorSettings from './pages/CreatorSettings';
// Auth pages
import RoleSelect from './pages/auth/RoleSelect';
import BusinessLogin from './pages/auth/BusinessLogin';
import CreatorLogin from './pages/auth/CreatorLogin';
import BusinessSignup from './pages/auth/BusinessSignup';
import CreatorSignup from './pages/auth/CreatorSignup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import GoogleCallback from './pages/auth/GoogleCallback';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public auth routes */}
          <Route path="/login" element={<RoleSelect />} />
          <Route path="/business/login" element={<BusinessLogin />} />
          <Route path="/creator/login" element={<CreatorLogin />} />
          <Route path="/business/signup" element={<BusinessSignup />} />
          <Route path="/creator/signup" element={<CreatorSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/callback" element={<GoogleCallback />} />

          {/* Protected Business Routes */}
          <Route element={<ProtectedRoute requiredRole="business" />}>
            <Route path="/business" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="campaigns/create" element={<CreateCampaign />} />
              <Route path="creators" element={<Creators />} />
              <Route path="assets" element={<Assets />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="payments" element={<Payments />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Protected Creator Routes */}
          <Route element={<ProtectedRoute requiredRole="creator" />}>
            <Route path="/creator" element={<CreatorLayout />}>
              <Route index element={<CreatorDashboard />} />
              <Route path="tasks" element={<CreatorTasks />} />
              <Route path="campaigns" element={<CreatorCampaigns />} />
              <Route path="analytics" element={<CreatorAnalytics />} />
              <Route path="earnings" element={<CreatorEarnings />} />
              <Route path="settings" element={<CreatorSettings />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;