'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { patientAPI } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';
import CredentialsModal from '@/components/CredentialsModal';

export default function AddPatientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    relationship: '',
    allergies: '',
    medical_conditions: '',
    emergency_contact: '',
    doctor_name: '',
    doctor_contact: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await patientAPI.create({
        ...formData,
        age: parseInt(formData.age),
      });
      
      // Show patient credentials in modal (only shown once)
      if (response.data.patient.patient_credentials) {
        setCredentials({
          email: response.data.patient.patient_credentials.email,
          password: response.data.patient.patient_credentials.password
        });
        setShowCredentials(true);
      } else {
        router.push(`/patients/${response.data.patient.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create patient. Please try again.');
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
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-4xl font-bold text-[#4a2e1e] mb-8 drop-shadow-sm">
          Add New Patient
        </h1>

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
          {error && (
            <div className="bg-[#fbf0ea] border border-[#ede0d0] text-[#8c4a35] px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                Patient Name *
              </label>
              <input
                type="text"
                id="name"
                required
                className="mt-1 block w-full px-4 py-3 border border-[#ede0d0] rounded-xl shadow-sm bg-white/70 backdrop-blur-sm text-[#4a2e1e] placeholder-[#a89887] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35] transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  required
                  min="1"
                  max="150"
                  className="mt-1 block w-full px-4 py-3 border border-[#ede0d0] rounded-xl shadow-sm bg-white/70 backdrop-blur-sm text-[#4a2e1e] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35] transition-all"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  className="mt-1 block w-full px-4 py-3 border border-[#ede0d0] rounded-xl shadow-sm bg-white/70 backdrop-blur-sm text-[#4a2e1e] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35] transition-all"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="relationship" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                Relationship
              </label>
              <input
                type="text"
                id="relationship"
                className="mt-1 block w-full px-4 py-3 border border-[#ede0d0] rounded-xl shadow-sm bg-white/70 backdrop-blur-sm text-[#4a2e1e] placeholder-[#a89887] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35] transition-all"
                placeholder="e.g., Father, Mother, Grandparent"
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="allergies" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                Allergies
              </label>
              <textarea
                id="allergies"
                rows={2}
                className="mt-1 block w-full px-4 py-3 border border-[#ede0d0] rounded-xl shadow-sm bg-white/70 backdrop-blur-sm text-[#4a2e1e] placeholder-[#a89887] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35] transition-all resize-none"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="medical_conditions" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                Medical Conditions
              </label>
              <textarea
                id="medical_conditions"
                rows={3}
                className="mt-1 block w-full px-4 py-3 border border-[#ede0d0] rounded-xl shadow-sm bg-white/70 backdrop-blur-sm text-[#4a2e1e] placeholder-[#a89887] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35] transition-all resize-none"
                value={formData.medical_conditions}
                onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="emergency_contact" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                Emergency Contact
              </label>
              <input
                type="text"
                id="emergency_contact"
                className="mt-1 block w-full px-4 py-3 border border-[#ede0d0] rounded-xl shadow-sm bg-white/70 backdrop-blur-sm text-[#4a2e1e] placeholder-[#a89887] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35] transition-all"
                placeholder="Name and phone number"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="doctor_name" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  id="doctor_name"
                  className="mt-1 block w-full px-4 py-3 border border-[#ede0d0] rounded-xl shadow-sm bg-white/70 backdrop-blur-sm text-[#4a2e1e] placeholder-[#a89887] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35] transition-all"
                  value={formData.doctor_name}
                  onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="doctor_contact" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                  Doctor Contact
                </label>
                <input
                  type="text"
                  id="doctor_contact"
                  className="mt-1 block w-full px-4 py-3 border border-[#ede0d0] rounded-xl shadow-sm bg-white/70 backdrop-blur-sm text-[#4a2e1e] placeholder-[#a89887] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] focus:border-[#8c4a35] transition-all"
                  value={formData.doctor_contact}
                  onChange={(e) => setFormData({ ...formData, doctor_contact: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#8c4a35] hover:bg-[#723a28] text-white px-6 py-3 rounded-xl disabled:opacity-50 transition-all shadow-sm hover:shadow-md font-semibold backdrop-blur-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Patient'
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-[#ede0d0] rounded-xl hover:bg-white text-[#5a3e2b] font-semibold transition-all shadow-sm hover:shadow-md backdrop-blur-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Credentials Modal */}
      {showCredentials && credentials && (
        <CredentialsModal
          email={credentials.email}
          password={credentials.password}
          patientName={formData.name}
          onClose={() => {
            setShowCredentials(false);
            router.push(`/patients`);
          }}
        />
      )}
    </div>
    </AuthGuard>
  );
}

