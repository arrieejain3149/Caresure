'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { medicalCardAPI } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';

interface MedicalCard {
  id: number;
  qr_code: string;
  consent_given: boolean;
  expires_at: string;
  patient: {
    id: number;
    name: string;
    age: number;
    gender: string;
    allergies: string;
    medical_conditions: string;
  };
  medications: Array<{
    id: number;
    name: string;
    strength: string;
    dose_per_intake: string;
    frequency: string;
    time_slots: string;
  }>;
}

export default function MedicalCardPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  
  const [card, setCard] = useState<MedicalCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    loadCard();
  }, [patientId]);

  const loadCard = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await medicalCardAPI.get(patientId);
      setCard(response.data.card);
    } catch (err: any) {
      console.error('Failed to load medical card:', err);
      setError(err.response?.data?.error || 'Failed to load medical card');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!consentGiven) {
      setError('Please provide consent to generate the medical card');
      return;
    }

    setError('');
    setGenerating(true);

    try {
      const response = await medicalCardAPI.generate(patientId, { consent_given: true });
      setCard(response.data.card);
    } catch (err: any) {
      console.error('Failed to generate medical card:', err);
      setError(err.response?.data?.error || 'Failed to generate medical card');
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-[#8c4a35] hover:text-[#5a2e1e] mb-4 font-semibold transition-colors hover:bg-white/50 px-3 py-1 rounded-lg backdrop-blur-sm"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold text-[#4a2e1e] drop-shadow-sm">
              Medical Card
            </h1>
          </div>

          {error && (
            <div className="bg-[#fbf0ea] border border-[#ede0d0] text-[#8c4a35] px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-[#8c4a35]">Loading...</div>
          ) : !card ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🏥</div>
                <h2 className="text-2xl font-bold text-[#4a2e1e] mb-4">No Medical Card Generated</h2>
                <p className="text-[#7c6a5a] mb-6">
                  Generate a medical card with QR code that can be scanned by healthcare providers
                </p>
              </div>

              <div className="bg-[#f5ebe1] border border-[#ede0d0] rounded-xl p-4 mb-6">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-1 mr-3 w-5 h-5 text-[#8c4a35] focus:ring-[#8c4a35] rounded"
                  />
                  <span className="text-sm text-[#5a3e2b]">
                    I consent to sharing my medical information through this medical card. 
                    The QR code will allow healthcare providers to access essential medical information in emergencies.
                  </span>
                </label>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!consentGiven || generating}
                className="w-full bg-[#8c4a35] hover:bg-[#723a28] text-white px-6 py-3 rounded-xl disabled:opacity-50 transition-all shadow-sm hover:shadow-md font-semibold"
              >
                {generating ? 'Generating...' : 'Generate Medical Card'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Card Info */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#4a2e1e] mb-2">Medical Card</h2>
                    <p className="text-[#7c6a5a]">QR Code: <span className="font-mono font-semibold text-[#4a2e1e]">{card.qr_code}</span></p>
                    <p className="text-sm text-[#8c7464] mt-1">Expires: {formatDate(card.expires_at)}</p>
                  </div>
                  <div className="bg-[#ede0d0] text-[#5a3e2b] px-4 py-2 rounded-xl text-sm font-semibold">
                    Active
                  </div>
                </div>
              </div>

              {/* Patient Info */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
                <h3 className="text-xl font-bold text-[#4a2e1e] mb-4">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-[#7c6a5a] mb-1">Name</div>
                    <div className="font-semibold text-[#4a2e1e]">{card.patient.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#7c6a5a] mb-1">Age</div>
                    <div className="font-semibold text-[#4a2e1e]">{card.patient.age} years</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#7c6a5a] mb-1">Gender</div>
                    <div className="font-semibold text-[#4a2e1e] capitalize">{card.patient.gender}</div>
                  </div>
                  {card.patient.allergies && (
                    <div>
                      <div className="text-sm text-[#7c6a5a] mb-1">Allergies</div>
                      <div className="font-semibold text-[#4a2e1e]">{card.patient.allergies}</div>
                    </div>
                  )}
                  {card.patient.medical_conditions && (
                    <div className="col-span-2">
                      <div className="text-sm text-[#7c6a5a] mb-1">Medical Conditions</div>
                      <div className="font-semibold text-[#4a2e1e]">{card.patient.medical_conditions}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Medications */}
              {card.medications && card.medications.length > 0 && (
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
                  <h3 className="text-xl font-bold text-[#4a2e1e] mb-4">Current Medications</h3>
                  <div className="space-y-3">
                    {card.medications.map((med) => (
                      <div
                        key={med.id}
                        className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-[#ede0d0]"
                      >
                        <div className="font-semibold text-[#4a2e1e]">{med.name}</div>
                        <div className="text-sm text-[#7c6a5a] mt-1">
                          {med.strength} • {med.dose_per_intake} • {med.frequency}
                        </div>
                        {med.time_slots && (
                          <div className="text-xs text-[#8c7464] mt-1">Times: {med.time_slots}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* QR Code Display */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6 text-center">
                <h3 className="text-xl font-bold text-[#4a2e1e] mb-4">QR Code</h3>
                <div className="bg-white p-6 rounded-xl inline-block border-2 border-[#ede0d0]">
                  <div className="w-48 h-48 bg-[#faf6f0] rounded flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📱</div>
                      <div className="text-xs text-[#7c6a5a] font-mono">{card.qr_code}</div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#7c6a5a] mt-4">
                  Healthcare providers can scan this QR code to access medical information
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

