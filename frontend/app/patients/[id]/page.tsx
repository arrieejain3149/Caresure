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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
          <div className="text-amber-800">Loading...</div>
        </div>
      </AuthGuard>
    );
  }

  if (!patient) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
          <div className="text-amber-800">Patient not found</div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden">
      {/* Blurred background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-violet-600 hover:text-violet-700 mb-4 font-semibold transition-colors hover:bg-white/50 px-3 py-1 rounded-lg backdrop-blur-sm"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-rose-500 to-violet-600 bg-clip-text text-transparent drop-shadow-sm">
            {patient.name}
          </h1>
          <p className="text-amber-800/80 mt-2 text-lg">
            {patient.age} years old • {patient.gender}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-orange-200/50 mb-6">
          <div className="flex border-b border-orange-200/50 overflow-x-auto">
            {['overview', 'medications', 'schedule', 'device', 'reports', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-semibold capitalize transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-b-2 border-violet-500 text-violet-600 bg-violet-50/50'
                    : 'text-amber-700/70 hover:text-amber-900 hover:bg-white/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-orange-200/50 p-6">
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {patient.today_stats?.taken || 0}
                  </div>
                  <div className="text-amber-800/70 font-medium">Taken Today</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-orange-200/50 shadow-lg hover:shadow-xl transition-all">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {patient.today_stats?.missed || 0}
                  </div>
                  <div className="text-amber-800/70 font-medium">Missed Today</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-rose-200/50 shadow-lg hover:shadow-xl transition-all">
                  <div className="text-3xl font-bold text-rose-600 mb-2">
                    {patient.today_stats?.pending || 0}
                  </div>
                  <div className="text-amber-800/70 font-medium">Pending</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-amber-900 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/patients/${patientId}/medications/add`}
                    className="bg-gradient-to-r from-violet-500 to-violet-600 text-white px-6 py-3 rounded-xl hover:from-violet-600 hover:to-violet-700 transition-all shadow-lg hover:shadow-xl font-semibold backdrop-blur-sm"
                  >
                    Add Medication
                  </Link>
                  <Link
                    href={`/patients/${patientId}/reports`}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl font-semibold backdrop-blur-sm"
                  >
                    View Reports
                  </Link>
                  <Link
                    href={`/patients/${patientId}/device`}
                    className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl font-semibold backdrop-blur-sm"
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
                <h3 className="text-xl font-semibold text-amber-900">Medications</h3>
                <Link
                  href={`/patients/${patientId}/medications/add`}
                  className="bg-gradient-to-r from-violet-500 to-violet-600 text-white px-4 py-2 rounded-xl hover:from-violet-600 hover:to-violet-700 text-sm font-semibold transition-all shadow-lg hover:shadow-xl backdrop-blur-sm"
                >
                  Add Medication
                </Link>
              </div>

              {medications.length === 0 ? (
                <div className="text-center py-12 text-amber-700/70">
                  <div className="text-4xl mb-4">💊</div>
                  <p className="text-lg">No medications added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medications.map((med) => (
                    <div key={med.id} className="border border-orange-200/50 rounded-xl p-4 bg-white/50 backdrop-blur-sm hover:bg-white/70 hover:border-violet-400 hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-amber-900 text-lg">{med.name}</h4>
                          <p className="text-sm text-amber-800/70 mt-1">
                            {med.strength} • {med.dose_per_intake} • {med.frequency}
                          </p>
                          {med.time_slots && (
                            <p className="text-sm text-amber-700/60 mt-1">
                              Times: {med.time_slots}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button className="text-violet-600 hover:text-violet-700 text-sm font-semibold px-3 py-1 rounded-lg hover:bg-violet-50/50 transition-all">
                            Edit
                          </button>
                          <button className="text-rose-600 hover:text-rose-700 text-sm font-semibold px-3 py-1 rounded-lg hover:bg-rose-50/50 transition-all">
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
              <h3 className="text-xl font-semibold text-amber-900 mb-4">Today's Schedule</h3>
              <Link
                href={`/patients/${patientId}/reports`}
                className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl font-semibold backdrop-blur-sm mb-4"
              >
                View Full Schedule & Reports
              </Link>
              <p className="text-amber-800/70">Schedule details are available in the Reports section.</p>
            </div>
          )}

          {activeTab === 'device' && (
            <div>
              <h3 className="text-xl font-semibold text-amber-900 mb-4">Device Status</h3>
              {patient.device ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-orange-200/50">
                      <div className="text-sm text-amber-700/70 mb-1">Connection Status</div>
                      <div className="font-semibold text-amber-900 text-lg">
                        {patient.device.is_connected ? (
                          <span className="text-emerald-600">Connected</span>
                        ) : (
                          <span className="text-rose-600">Disconnected</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-orange-200/50">
                      <div className="text-sm text-amber-700/70 mb-1">Battery Level</div>
                      <div className="font-semibold text-amber-900 text-lg">{patient.device.battery_level || 0}%</div>
                    </div>
                  </div>
                  <Link
                    href={`/patients/${patientId}/device`}
                    className="inline-block bg-gradient-to-r from-violet-500 to-violet-600 text-white px-4 py-2 rounded-xl hover:from-violet-600 hover:to-violet-700 text-sm font-semibold transition-all shadow-lg hover:shadow-xl backdrop-blur-sm"
                  >
                    View Device Details
                  </Link>
                </div>
              ) : (
                <div className="text-center py-12 text-amber-700/70">
                  <div className="text-4xl mb-4">📱</div>
                  <p className="text-lg mb-4">No device connected</p>
                  <Link
                    href={`/patients/${patientId}/device/connect`}
                    className="inline-block text-violet-600 hover:text-violet-700 font-semibold hover:bg-violet-50/50 px-4 py-2 rounded-xl transition-all"
                  >
                    Connect Device
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h3 className="text-xl font-semibold text-amber-900 mb-4">Adherence Reports</h3>
              <Link
                href={`/patients/${patientId}/reports`}
                className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl font-semibold backdrop-blur-sm"
              >
                View Full Reports
              </Link>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="text-xl font-semibold text-amber-900 mb-4">Medical History & Documents</h3>
              <div className="space-y-4">
                <Link
                  href={`/patients/${patientId}/documents`}
                  className="inline-block bg-gradient-to-r from-violet-500 to-violet-600 text-white px-6 py-3 rounded-xl hover:from-violet-600 hover:to-violet-700 transition-all shadow-lg hover:shadow-xl font-semibold backdrop-blur-sm"
                >
                  View Documents
                </Link>
                <div className="mt-4">
                  <Link
                    href={`/patients/${patientId}/medical-card`}
                    className="inline-block bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl font-semibold backdrop-blur-sm"
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

