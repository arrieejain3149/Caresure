'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { patientAuthAPI } from '@/lib/api';
import { setToken } from '@/lib/auth';
import CareSureLogo from '@/components/CareSureLogo';

export default function PatientLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [patientEmail, setPatientEmail] = useState('');
  const [passwordChangeData, setPasswordChangeData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Trim email and password to remove any whitespace
      const loginData = {
        email: formData.email.trim(),
        password: formData.password.trim(),
      };
      
      console.log('Attempting patient login with email:', loginData.email);
      
      const response = await patientAuthAPI.login(loginData);
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        setToken(response.data.token);
        
        // Check if password needs to be changed
        if (!response.data.patient.password_changed) {
          setPatientEmail(loginData.email);
          // Pre-fill current password from login form
          setPasswordChangeData({
            email: loginData.email,
            currentPassword: loginData.password,
            newPassword: '',
            confirmPassword: '',
          });
          setShowPasswordChange(true);
        } else {
          // Redirect to patient dashboard (you can create this later)
          router.push('/patient/dashboard');
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');

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
      await patientAuthAPI.changePassword({
        email: passwordChangeData.email || patientEmail,
        currentPassword: passwordChangeData.currentPassword,
        newPassword: passwordChangeData.newPassword,
      });

      // Password changed successfully
      setShowPasswordChange(false);
      setPasswordChangeData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        email: '',
      });
      // Clear form and show success message
      setFormData({ email: '', password: '' });
      alert('Password changed successfully! Please login with your new password.');
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

      {/* Background decoration: Soft Warm Beige & Brown Ambient Glow */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#ede0d0] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d9c5b2] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#8c4a35]/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-md w-full space-y-6 sm:space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#4a2e1e] drop-shadow-sm">
            Patient Login
          </h2>
          <p className="mt-4 text-center text-sm text-[#735d4e]">
            Sign in to view your medication schedule
          </p>
          <p className="mt-2 text-center text-xs text-[#8c7464]">
            Need credentials? Contact your caregiver who registered you.
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white/85 backdrop-blur-xl rounded-2xl shadow-xl border border-[#e8dccb] p-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-100/70 border border-red-300/50 text-red-800 px-4 py-3 rounded-xl backdrop-blur-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3.5 sm:py-3 border border-[#e0d3c1] placeholder-[#a89887] text-[#3e2c22] rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35] transition-all shadow-inner text-base min-h-[44px] touch-manipulation"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-[#e0d3c1] placeholder-[#a89887] text-[#3e2c22] rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35] transition-all shadow-inner"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setShowPasswordChange(true);
                setPasswordChangeData({ ...passwordChangeData, email: formData.email, currentPassword: formData.password });
              }}
              className="text-sm text-[#8c4a35] hover:text-[#5a2e1e] transition-colors font-medium underline decoration-[#8c4a35]/50 underline-offset-4"
            >
              Change Password?
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 sm:py-3 px-4 border border-transparent text-base sm:text-sm font-semibold rounded-xl text-white bg-[#8c4a35] hover:bg-[#783e2c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8c4a35] disabled:opacity-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#8c4a35]/30 min-h-[44px] touch-manipulation active:scale-95"
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
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full border border-[#ede0d0] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ede0d0] rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#e5d5c3] rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 p-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-[#ede0d0] rounded-full flex items-center justify-center mb-4 shadow-sm border border-[#e5d5c3]">
                  <svg className="w-8 h-8 text-[#8c4a35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#4a2e1e]">
                  Change Your Password
                </h2>
                <p className="text-[#7c6a5a] mt-2">Please set a new password for your account</p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                {passwordChangeError && (
                  <div className="bg-[#fbf0ea] border border-[#ede0d0] text-[#8c4a35] px-4 py-3 rounded-xl backdrop-blur-sm text-sm">
                    {passwordChangeError}
                  </div>
                )}

                <div>
                  <label htmlFor="changePatientEmail" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                    Email
                  </label>
                  <input
                    id="changePatientEmail"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-[#ede0d0] rounded-xl bg-white/70 backdrop-blur-sm text-[#4a2e1e] focus:outline-none focus:ring-2 focus:ring-[#8c4a35]"
                    value={passwordChangeData.email || patientEmail}
                    onChange={(e) => setPasswordChangeData({ ...passwordChangeData, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-[#ede0d0] rounded-xl bg-white/70 backdrop-blur-sm text-[#4a2e1e] focus:outline-none focus:ring-2 focus:ring-[#8c4a35]"
                    value={passwordChangeData.currentPassword}
                    onChange={(e) => setPasswordChangeData({ ...passwordChangeData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-[#ede0d0] rounded-xl bg-white/70 backdrop-blur-sm text-[#4a2e1e] focus:outline-none focus:ring-2 focus:ring-[#8c4a35]"
                    value={passwordChangeData.newPassword}
                    onChange={(e) => setPasswordChangeData({ ...passwordChangeData, newPassword: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-[#ede0d0] rounded-xl bg-white/70 backdrop-blur-sm text-[#4a2e1e] focus:outline-none focus:ring-2 focus:ring-[#8c4a35]"
                    value={passwordChangeData.confirmPassword}
                    onChange={(e) => setPasswordChangeData({ ...passwordChangeData, confirmPassword: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={passwordChangeLoading}
                    className="flex-1 bg-[#8c4a35] hover:bg-[#723a28] text-white px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md font-semibold disabled:opacity-50"
                  >
                    {passwordChangeLoading ? 'Changing...' : 'Change Password'}
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

