'use client';

import { useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    emergency_contact: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setProfile(response.data.caregiver);
      setFormData({
        name: response.data.caregiver.name || '',
        phone: response.data.caregiver.phone || '',
        emergency_contact: response.data.caregiver.emergency_contact || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await authAPI.updateProfile(formData);
      alert('Profile updated successfully!');
      loadProfile();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center bg-[#faf6f0]">
          <div className="text-[#8c4a35] font-medium">Loading...</div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
    <div className="min-h-screen bg-[#faf6f0] py-8 relative overflow-hidden">
      {/* Blurred background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ede0d0] rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e5d5c3] rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#f2e6d9] rounded-full blur-3xl opacity-50"></div>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-4xl font-bold text-[#4a2e1e] mb-8 drop-shadow-sm">
          Settings
        </h1>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
          <h2 className="text-xl font-semibold text-[#4a2e1e] mb-6">Account Settings</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#4a2e1e]">
                Email
              </label>
              <input
                type="email"
                id="email"
                disabled
                value={profile?.email || ''}
                className="mt-1 block w-full px-3 py-2 border border-[#ede0d0] rounded-md bg-[#faf6f0]/60 text-[#7c6a5a]"
              />
              <p className="mt-1 text-sm text-[#7c6a5a]">Email cannot be changed</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#4a2e1e]">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="mt-1 block w-full px-3 py-2 border border-[#ede0d0] rounded-md shadow-sm bg-white/70 backdrop-blur-sm text-[#4a2e1e] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35]"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#4a2e1e]">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="mt-1 block w-full px-3 py-2 border border-[#ede0d0] rounded-md shadow-sm bg-white/70 backdrop-blur-sm text-[#4a2e1e] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35]"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="emergency_contact" className="block text-sm font-medium text-[#4a2e1e]">
                Emergency Contact
              </label>
              <input
                type="text"
                id="emergency_contact"
                className="mt-1 block w-full px-3 py-2 border border-[#ede0d0] rounded-md shadow-sm bg-white/70 backdrop-blur-sm text-[#4a2e1e] placeholder-[#a89887] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35]"
                placeholder="Name and phone number"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#8c4a35] hover:bg-[#723a28] text-white px-6 py-2 rounded-lg disabled:opacity-50 transition-all shadow-sm hover:shadow-md font-medium backdrop-blur-sm"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}

