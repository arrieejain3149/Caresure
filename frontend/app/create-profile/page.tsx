'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';

export default function CreateProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    emergency_contact: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.updateProfile(formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
    <div className="min-h-screen bg-[#faf6f0] py-8 relative overflow-hidden">
      {/* Blurred background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ede0d0] rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e5d5c3] rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#f2e6d9] rounded-full blur-3xl opacity-50"></div>
      </div>
      
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[#4a2e1e] drop-shadow-sm">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-[#7c6a5a]">
            Add your details to get started
          </p>
        </div>
        
        <form className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-[#fbf0ea] border border-[#ede0d0] text-[#8c4a35] px-4 py-3 rounded-xl backdrop-blur-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-4 py-3 border border-[#ede0d0] rounded-xl shadow-sm bg-white/70 backdrop-blur-sm text-[#4a2e1e] placeholder-[#a89887] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35] transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="mt-1 block w-full px-4 py-3 border border-[#ede0d0] rounded-xl shadow-sm bg-white/70 backdrop-blur-sm text-[#4a2e1e] placeholder-[#a89887] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35] transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="emergency_contact" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                Emergency Contact
              </label>
              <input
                id="emergency_contact"
                name="emergency_contact"
                type="text"
                className="mt-1 block w-full px-4 py-3 border border-[#ede0d0] rounded-xl shadow-sm bg-white/70 backdrop-blur-sm text-[#4a2e1e] placeholder-[#a89887] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35] transition-all"
                placeholder="Name and phone number"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-[#8c4a35] hover:bg-[#723a28] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8c4a35] disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </AuthGuard>
  );
}

