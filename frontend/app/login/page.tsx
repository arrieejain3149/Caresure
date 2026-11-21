'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { setToken } from '@/lib/auth';
import CareSureLogo from '@/components/CareSureLogo';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState('/dashboard');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordChangeData, setPasswordChangeData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  
  // Get redirect URL from query parameters (with security validation)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      if (redirect) {
        // Validate redirect URL - only allow internal routes (starting with /)
        // Prevent open redirect vulnerabilities
        if (redirect.startsWith('/') && !redirect.startsWith('//')) {
          setRedirectTo(redirect);
        }
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { email: formData.email });
      
      // Test connection first
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://careure-ebm-backend.onrender.com/api';
      try {
        const healthCheck = await fetch(`${apiUrl}/health`);
        if (!healthCheck.ok) {
          throw new Error('Backend server is not responding');
        }
      } catch (healthError) {
        setError('Unable to connect to server. Please check your internet connection.');
        setLoading(false);
        return;
      }
      
      const response = await authAPI.login(formData);
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        // Save token to localStorage
        setToken(response.data.token);
        console.log('Token saved, redirecting to:', redirectTo);
        
        // Use window.location for reliable redirect after login
        // Small delay ensures token is saved to localStorage first
        // Redirect to the intended page (from query param) or default to dashboard
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 100);
      } else {
        setError('No token received from server');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // Handle different error types
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      
      if (err.response) {
        // Server responded with error
        if (err.response.status === 400) {
          // Validation error
          const validationErrors = err.response.data?.errors;
          if (validationErrors && Array.isArray(validationErrors)) {
            errorMessage = validationErrors.map((e: any) => e.msg || e.message).join(', ');
          } else {
            errorMessage = err.response.data?.error || 'Please check your input fields.';
          }
        } else if (err.response.status === 401) {
          // Authentication error
          errorMessage = err.response.data?.error || 'Invalid email or password. Please try again.';
        } else if (err.response.status === 500) {
          // Server error
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = err.response.data?.error || errorMessage;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      } else {
        // Error setting up the request
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess(false);

    if (passwordChangeData.newPassword !== passwordChangeData.confirmPassword) {
      setPasswordChangeError('New passwords do not match');
      return;
    }

    if (passwordChangeData.newPassword.length < 6) {
      setPasswordChangeError('Password must be at least 6 characters long');
      return;
    }

    setPasswordChangeLoading(true);

    try {
      await authAPI.changePassword({
        email: passwordChangeData.email.trim(),
        currentPassword: passwordChangeData.currentPassword,
        newPassword: passwordChangeData.newPassword,
      });

      setPasswordChangeSuccess(true);
      setPasswordChangeData({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Close modal after 2 seconds and show success message
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordChangeSuccess(false);
      }, 2000);
    } catch (err: any) {
      setPasswordChangeError(err.response?.data?.error || 'Failed to change password. Please try again.');
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf6f0] via-[#f5ebe1] to-[#ede0d0] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Top Header / Navbar: Consistent CareSure Brand Logo */}
      <div className="absolute top-5 left-5 sm:top-7 sm:left-8 lg:left-12 z-30">
        <CareSureLogo variant="dark" size="md" href="/" />
      </div>

      {/* Background Decorations: Soft Beige & Warm Brown Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ede0d0] rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#d9c5b2] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#f0e4d7] rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-[#faf6f0]/40 pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 sm:space-y-8 relative z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-[#e8dccb]">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#4a2e1e]">
              Sign in to <span className="text-[#8c4a35]">PillVox</span>
            </h2>
            <p className="mt-4 text-center text-sm text-[#735d4e]">
              Or{' '}
              <Link href="/signup" className="font-medium text-[#8c4a35] hover:text-[#5a2e1e] transition-colors underline decoration-[#8c4a35] underline-offset-4">
                create a new account
              </Link>
            </p>
            <p className="mt-2 text-center text-sm text-[#8c7464]">
              Are you a patient?{' '}
              <Link href="/patient/login" className="font-medium text-[#8c4a35] hover:text-[#5a2e1e] transition-colors font-semibold">
                Patient Login
              </Link>
            </p>
          </div>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg backdrop-blur-sm text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#4a2e1e] mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-4 py-3.5 sm:py-3 border-2 border-[#e0d3c1] placeholder-[#a89887] text-[#3e2c22] rounded-lg bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35] transition-all shadow-sm hover:shadow-md text-base min-h-[44px] touch-manipulation"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#4a2e1e] mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-4 py-3.5 sm:py-3 border-2 border-[#e0d3c1] placeholder-[#a89887] text-[#3e2c22] rounded-lg bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35] transition-all shadow-sm hover:shadow-md text-base min-h-[44px] touch-manipulation"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowChangePassword(true);
                  setPasswordChangeData({ ...passwordChangeData, email: formData.email });
                }}
                className="text-sm font-medium text-[#8c4a35] hover:text-[#5a2e1e] transition-colors min-h-[44px] px-1 touch-manipulation"
              >
                Change Password?
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 sm:py-3 px-4 border border-transparent text-base sm:text-sm font-semibold rounded-lg text-white bg-[#8c4a35] hover:bg-[#723a28] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8c4a35] disabled:opacity-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#8c4a35]/40 min-h-[44px] touch-manipulation active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full border border-[#e8dccb] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ede0d0] rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d9c5b2] rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#4a2e1e]">
                  Change Password
                </h2>
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordChangeError('');
                    setPasswordChangeSuccess(false);
                  }}
                  className="text-[#8c7464] hover:text-[#4a2e1e] transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {passwordChangeSuccess && (
                <div className="bg-[#f5ebe1] border border-[#ede0d0] text-[#4a2e1e] px-4 py-3 rounded-xl mb-4 backdrop-blur-sm">
                  Password changed successfully! You can now login with your new password.
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                {passwordChangeError && !passwordChangeSuccess && (
                  <div className="bg-[#fbf0ea] border border-[#ede0d0] text-[#8c4a35] px-4 py-3 rounded-xl backdrop-blur-sm text-sm">
                    {passwordChangeError}
                  </div>
                )}

                <div>
                  <label htmlFor="changeEmail" className="block text-sm font-medium text-[#4a2e1e] mb-2">
                    Email
                  </label>
                  <input
                    id="changeEmail"
                    type="email"
                    required
                    className="w-full px-4 py-3 border-2 border-[#e0d3c1] rounded-xl bg-white/90 backdrop-blur-sm text-[#3e2c22] placeholder-[#a89887] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35]"
                    value={passwordChangeData.email}
                    onChange={(e) => setPasswordChangeData({ ...passwordChangeData, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-[#4a2e1e] mb-2">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    required
                    className="w-full px-4 py-3 border-2 border-[#e0d3c1] rounded-xl bg-white/90 backdrop-blur-sm text-[#3e2c22] placeholder-[#a89887] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35]"
                    value={passwordChangeData.currentPassword}
                    onChange={(e) => setPasswordChangeData({ ...passwordChangeData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-[#4a2e1e] mb-2">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border-2 border-[#e0d3c1] rounded-xl bg-white/90 backdrop-blur-sm text-[#3e2c22] placeholder-[#a89887] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35]"
                    value={passwordChangeData.newPassword}
                    onChange={(e) => setPasswordChangeData({ ...passwordChangeData, newPassword: e.target.value })}
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#4a2e1e] mb-2">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border-2 border-[#e0d3c1] rounded-xl bg-white/90 backdrop-blur-sm text-[#3e2c22] placeholder-[#a89887] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35]"
                    value={passwordChangeData.confirmPassword}
                    onChange={(e) => setPasswordChangeData({ ...passwordChangeData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={passwordChangeLoading || passwordChangeSuccess}
                    className="flex-1 bg-[#8c4a35] hover:bg-[#723a28] text-white px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50"
                  >
                    {passwordChangeLoading ? 'Changing...' : passwordChangeSuccess ? 'Success!' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

