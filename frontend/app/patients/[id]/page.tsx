'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { patientAPI, medicationAPI, reminderAPI, deviceAPI, reportAPI } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  medication_count: number;
  today_stats: {
    taken: number;
    missed: number;
    pending: number;
  };
  device: any;
}

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medications, setMedications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    try {
      const [patientRes, medicationsRes] = await Promise.all([
        patientAPI.getById(patientId),
        medicationAPI.getByPatient(patientId),
      ]);

      setPatient(patientRes.data.patient);
      setMedications(medicationsRes.data.medications || []);
    } catch (error) {
      console.error('Failed to load patient data:', error);
    } finally {
      setLoading(false);
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

  if (!patient) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center bg-[#faf6f0]">
          <div className="text-[#8c4a35]">Patient not found</div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
    <div className="min-h-screen bg-[#faf6f0] relative overflow-hidden">
      {/* Blurred background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ede0d0] rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e5d5c3] rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#f2e6d9] rounded-full blur-3xl opacity-50"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-[#8c4a35] hover:text-[#5a2e1e] mb-4 font-semibold transition-colors hover:bg-white/50 px-3 py-1 rounded-lg backdrop-blur-sm"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-[#4a2e1e] drop-shadow-sm">
            {patient.name}
          </h1>
          <p className="text-[#7c6a5a] mt-2 text-lg">
            {patient.age} years old • {patient.gender}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] mb-6">
          <div className="flex border-b border-[#ede0d0] overflow-x-auto">
            {['overview', 'medications', 'schedule', 'device', 'reports', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-semibold capitalize transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-b-2 border-[#8c4a35] text-[#8c4a35] bg-[#f5ebe1]/60'
                    : 'text-[#7c6a5a] hover:text-[#4a2e1e] hover:bg-white/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-[#ede0d0] shadow-sm hover:shadow-md transition-all">
                  <div className="text-3xl font-bold text-[#5a3e2b] mb-2">
                    {patient.today_stats?.taken || 0}
                  </div>
                  <div className="text-[#7c6a5a] font-medium">Taken Today</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-[#ede0d0] shadow-sm hover:shadow-md transition-all">
                  <div className="text-3xl font-bold text-[#8c4a35] mb-2">
                    {patient.today_stats?.missed || 0}
                  </div>
                  <div className="text-[#7c6a5a] font-medium">Missed Today</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-[#ede0d0] shadow-sm hover:shadow-md transition-all">
                  <div className="text-3xl font-bold text-[#4a2e1e] mb-2">
                    {patient.today_stats?.pending || 0}
                  </div>
                  <div className="text-[#7c6a5a] font-medium">Pending</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#4a2e1e] mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/patients/${patientId}/medications/add`}
                    className="bg-[#8c4a35] hover:bg-[#723a28] text-white px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md font-semibold backdrop-blur-sm"
                  >
                    Add Medication
                  </Link>
                  <Link
                    href={`/patients/${patientId}/reports`}
                    className="bg-[#ede0d0] hover:bg-[#dfcebc] text-[#5a3e2b] px-6 py-3 rounded-xl transition-all border border-[#d9c5b2] shadow-sm hover:shadow-md font-semibold backdrop-blur-sm"
                  >
                    View Reports
                  </Link>
                  <Link
                    href={`/patients/${patientId}/device`}
                    className="bg-[#f5ebe1] hover:bg-[#ebdccb] text-[#6e4e37] px-6 py-3 rounded-xl transition-all border border-[#ede0d0] shadow-sm hover:shadow-md font-semibold backdrop-blur-sm"
                  >
                    Device Status
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medications' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[#4a2e1e]">Medications</h3>
                <Link
                  href={`/patients/${patientId}/medications/add`}
                  className="bg-[#8c4a35] hover:bg-[#723a28] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md backdrop-blur-sm"
                >
                  Add Medication
                </Link>
              </div>

              {medications.length === 0 ? (
                <div className="text-center py-12 text-[#7c6a5a]">
                  <div className="text-4xl mb-4">💊</div>
                  <p className="text-lg">No medications added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medications.map((med) => (
                    <div key={med.id} className="border border-[#ede0d0] rounded-xl p-4 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-[#8c4a35]/40 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-[#4a2e1e] text-lg">{med.name}</h4>
                          <p className="text-sm text-[#7c6a5a] mt-1">
                            {med.strength} • {med.dose_per_intake} • {med.frequency}
                          </p>
                          {med.time_slots && (
                            <p className="text-sm text-[#8c7464] mt-1">
                              Times: {med.time_slots}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button className="text-[#8c4a35] hover:text-[#5a2e1e] text-sm font-semibold px-3 py-1 rounded-lg hover:bg-[#f5ebe1] transition-all">
                            Edit
                          </button>
                          <button className="text-[#7c6a5a] hover:text-[#4a2e1e] text-sm font-semibold px-3 py-1 rounded-lg hover:bg-[#f5ebe1] transition-all">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div>
              <h3 className="text-xl font-semibold text-[#4a2e1e] mb-4">Today's Schedule</h3>
              <Link
                href={`/patients/${patientId}/reports`}
                className="inline-block bg-[#8c4a35] hover:bg-[#723a28] text-white px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md font-semibold backdrop-blur-sm mb-4"
              >
                View Full Schedule & Reports
              </Link>
              <p className="text-[#7c6a5a]">Schedule details are available in the Reports section.</p>
            </div>
          )}

          {activeTab === 'device' && (
            <div>
              <h3 className="text-xl font-semibold text-[#4a2e1e] mb-4">Device Status</h3>
              {patient.device ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-[#ede0d0]">
                      <div className="text-sm text-[#7c6a5a] mb-1">Connection Status</div>
                      <div className="font-semibold text-[#4a2e1e] text-lg">
                        {patient.device.is_connected ? (
                          <span className="text-[#5a3e2b]">Connected</span>
                        ) : (
                          <span className="text-[#8c4a35]">Disconnected</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-[#ede0d0]">
                      <div className="text-sm text-[#7c6a5a] mb-1">Battery Level</div>
                      <div className="font-semibold text-[#4a2e1e] text-lg">{patient.device.battery_level || 0}%</div>
                    </div>
                  </div>
                  <Link
                    href={`/patients/${patientId}/device`}
                    className="inline-block bg-[#8c4a35] hover:bg-[#723a28] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md backdrop-blur-sm"
                  >
                    View Device Details
                  </Link>
                </div>
              ) : (
                <div className="text-center py-12 text-[#7c6a5a]">
                  <div className="text-4xl mb-4">📱</div>
                  <p className="text-lg mb-4">No device connected</p>
                  <Link
                    href={`/patients/${patientId}/device/connect`}
                    className="inline-block text-[#8c4a35] hover:text-[#5a2e1e] font-semibold hover:bg-[#f5ebe1] px-4 py-2 rounded-xl transition-all"
                  >
                    Connect Device
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h3 className="text-xl font-semibold text-[#4a2e1e] mb-4">Adherence Reports</h3>
              <Link
                href={`/patients/${patientId}/reports`}
                className="inline-block bg-[#8c4a35] hover:bg-[#723a28] text-white px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md font-semibold backdrop-blur-sm"
              >
                View Full Reports
              </Link>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="text-xl font-semibold text-[#4a2e1e] mb-4">Medical History & Documents</h3>
              <div className="space-y-4">
                <Link
                  href={`/patients/${patientId}/documents`}
                  className="inline-block bg-[#8c4a35] hover:bg-[#723a28] text-white px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md font-semibold backdrop-blur-sm"
                >
                  View Documents
                </Link>
                <div className="mt-4">
                  <Link
                    href={`/patients/${patientId}/medical-card`}
                    className="inline-block bg-[#ede0d0] hover:bg-[#dfcebc] text-[#5a3e2b] px-6 py-3 rounded-xl transition-all border border-[#d9c5b2] shadow-sm hover:shadow-md font-semibold backdrop-blur-sm"
                  >
                    View Medical Card
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}

