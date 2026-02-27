import { Link, Navigate } from 'react-router-dom';
import { Building2, Palette } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const RoleSelect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If already logged in, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    return <Navigate to={user.user_type === 'business' ? '/business' : '/creator'} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold bg-linear-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            CreatorStop
          </h1>
          <p className="text-gray-500 mt-3 text-sm">Choose how you want to sign in</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Business Card */}
          <Link
            to="/business/login"
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-purple-200 transition-all duration-200"
          >
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
              <Building2 className="w-7 h-7 text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">I'm a Business</h2>
            <p className="text-sm text-gray-500">
              Manage campaigns, find creators, and track performance.
            </p>
          </Link>

          {/* Creator Card */}
          <Link
            to="/creator/login"
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-pink-200 transition-all duration-200"
          >
            <div className="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-100 transition-colors">
              <Palette className="w-7 h-7 text-pink-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">I'm a Creator</h2>
            <p className="text-sm text-gray-500">
              Discover opportunities, manage tasks, and grow your earnings.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
