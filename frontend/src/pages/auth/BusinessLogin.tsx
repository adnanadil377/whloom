import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from '../../components/auth/LoginForm';

const BusinessLogin = () => {
  const { login, isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to={user.user_type === 'business' ? '/business' : '/creator'} replace />;
  }

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedInUser = await login({ email, password });
      navigate(loggedInUser.user_type === 'business' ? '/business' : '/creator', { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.detail || err?.response?.data?.message || 'Invalid email or password';
      setError(typeof message === 'string' ? message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm
      userType="business"
      onSubmit={handleLogin}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default BusinessLogin;
