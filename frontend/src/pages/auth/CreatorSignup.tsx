import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SignupForm from '../../components/auth/SignupForm';
import type { SignupRequest } from '../../types';

const CreatorSignup = () => {
  const { signup, isAuthenticated, user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleSignup = async (data: SignupRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const message = await signup(data);
      setSuccess(message || 'Account created! Please check your email to verify your account.');
    } catch (err: any) {
      const message =
        err?.response?.data?.detail || err?.response?.data?.message || 'Signup failed';
      setError(typeof message === 'string' ? message : 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignupForm
      userType="creator"
      onSubmit={handleSignup}
      isLoading={isLoading}
      error={error}
      success={success}
    />
  );
};

export default CreatorSignup;
