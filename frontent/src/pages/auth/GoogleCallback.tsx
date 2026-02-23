import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const GoogleCallback = () => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // After Google OAuth, the backend has already set cookies.
        // Just fetch the user to determine their role and redirect.
        await refreshUser();

        // Small delay to allow state to propagate
        setTimeout(() => {
          // Re-read the user from the API to get fresh data
          const checkUser = async () => {
            try {
              const res = await fetch('/api/v1/auth/me', { credentials: 'include' });
              if (res.ok) {
                const user = await res.json();
                navigate(user.user_type === 'business' ? '/business' : '/creator', { replace: true });
              } else {
                setError('Authentication failed. Please try again.');
              }
            } catch {
              setError('Something went wrong. Please try logging in again.');
            }
          };
          checkUser();
        }, 500);
      } catch {
        setError('Authentication failed. Please try again.');
      }
    };

    handleCallback();
  }, [refreshUser, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Error</h2>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Completing sign in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
