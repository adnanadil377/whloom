import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { authApi } from '../../services/authApi';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found. Please check your email link.');
      return;
    }

    const verify = async () => {
      try {
        const response = await authApi.verifyEmail({ token });
        setStatus('success');
        setMessage(response.message || 'Your email has been verified successfully!');
      } catch (err: any) {
        setStatus('error');
        const detail = err?.response?.data?.detail;
        setMessage(
          typeof detail === 'string'
            ? detail
            : 'Verification failed. The link may have expired.'
        );
      }
    };

    verify();
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendLoading(true);
    try {
      await authApi.resendVerification(resendEmail);
      setResendSent(true);
    } catch {
      setResendSent(true); // Don't leak info
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8">
          <Link to="/login">
            <h1 className="text-3xl font-extrabold bg-linear-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              CreatorStop
            </h1>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {status === 'verifying' && (
            <>
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying your email...</h2>
              <p className="text-gray-500 text-sm">Please wait while we confirm your email address.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-500 text-sm mb-6">{message}</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Go to Login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-500 text-sm mb-6">{message}</p>

              {/* Resend section */}
              {!resendSent ? (
                <div className="border-t border-gray-100 pt-6">
                  <p className="text-sm text-gray-600 mb-3">Need a new verification email?</p>
                  <form onSubmit={handleResend} className="flex gap-2">
                    <input
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={resendLoading}
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                    >
                      {resendLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Resend'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                    <Mail className="w-4 h-4" />
                    Verification email sent! Check your inbox.
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Link
                  to="/login"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
