'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { patientSelfAPI } from '@/lib/api';
import PatientAuthGuard from '@/components/PatientAuthGuard';
import { removeToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import CareSureLogo from '@/components/CareSureLogo';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  relationship?: string;
  allergies?: string;
  medical_conditions?: string;
  emergency_contact?: string;
  doctor_name?: string;
  doctor_contact?: string;
}

interface Stats {
  today: {
    taken: number;
    missed: number;
    pending: number;
  };
  totalMedications: number;
  adherence7Days: number;
}

interface Dose {
  id: number;
  medication_name: string;
  strength: string;
  dose_per_intake: string;
  scheduled_time: string;
  status: string;
  time_slot: string;
  food_rule: string;
}

interface Medication {
  id: number;
  name: string;
  strength: string;
  dose_per_intake: string;
  frequency: string;
  time_slots: string;
}

export default function PatientDashboardPage() {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [todayDoses, setTodayDoses] = useState<Dose[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Test if backend is accessible
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

      const [profileRes, statsRes, dosesRes, medsRes] = await Promise.all([
        patientSelfAPI.getProfile(),
        patientSelfAPI.getStats(),
        patientSelfAPI.getTodayDoses(),
        patientSelfAPI.getMedications(),
      ]);

      setPatient(profileRes.data.patient);
      setStats(statsRes.data);
      setTodayDoses(dosesRes.data.doses || []);
      setMedications(medsRes.data.medications || []);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response?.status === 404) {
        setError('Patient routes not found. Please restart the backend server to load the new patient routes.');
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Authentication failed. Please log in again.');
        setTimeout(() => {
          router.push('/patient/login');
        }, 2000);
      } else {
        setError(err.response?.data?.error || 'Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkTaken = async (doseId: number) => {
    try {
      await patientSelfAPI.markDoseTaken(doseId.toString());
      loadDashboardData(); // Reload data
    } catch (err: any) {
      console.error('Failed to mark dose as taken:', err);
      alert(err.response?.data?.error || 'Failed to mark dose as taken');
    }
  };

  const handleMarkMissed = async (doseId: number) => {
    try {
      await patientSelfAPI.markDoseMissed(doseId.toString());
      loadDashboardData(); // Reload data
    } catch (err: any) {
      console.error('Failed to mark dose as missed:', err);
      alert(err.response?.data?.error || 'Failed to mark dose as missed');
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push('/patient/login');
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken':
        return 'bg-[#f5ebe1] border-[#ede0d0] text-[#5a3e2b]';
      case 'missed':
        return 'bg-[#fbf0ea] border-[#ede0d0] text-[#8c4a35]';
      case 'pending':
        return 'bg-[#faf6f0] border-[#ede0d0] text-[#4a2e1e]';
      default:
        return 'bg-white border-[#ede0d0] text-[#5a3e2b]';
    }
  };

  if (loading) {
    return (
      <PatientAuthGuard>
        <div className="min-h-screen flex items-center justify-center bg-[#faf6f0]">
          <div className="text-[#8c4a35] font-medium">Loading...</div>
        </div>
      </PatientAuthGuard>
    );
  }

  return (
    <PatientAuthGuard>
      <div className="min-h-screen bg-[#faf6f0] relative overflow-hidden">
        {/* Blurred background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ede0d0] rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e5d5c3] rounded-full blur-3xl opacity-40"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#f2e6d9] rounded-full blur-3xl opacity-50"></div>
        </div>

        {/* Navbar */}
        <nav className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-[#e8dccb] sticky top-0 z-50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-3">
                <CareSureLogo variant="dark" size="sm" href="/patient/dashboard" />
                <span className="text-xs text-[#8c7464] font-medium bg-[#f5ebe1] px-2.5 py-1 rounded-full border border-[#e8dccb]">
                  Patient Portal
                </span>
              </div>
              <div className="flex items-center gap-4">
                {patient && (
                  <span className="text-[#5a3e2b] font-medium hidden sm:inline">
                    Welcome, {patient.name}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="text-[#6b5344] hover:text-[#8c4a35] px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-[#ede0d0]/60 hover:shadow-sm border border-transparent hover:border-[#e8dccb]"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8">
          {error && (
            <div className="bg-[#fbf0ea] border border-[#ede0d0] text-[#8c4a35] px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm p-6 border border-[#ede0d0] hover:border-[#8c4a35]/40 transition-all duration-300 hover:scale-105 hover:shadow-md">
                <div className="text-3xl font-bold text-[#5a3e2b] mb-2">
                  {stats.today.taken}
                </div>
                <div className="text-[#7c6a5a] font-medium">Taken Today</div>
              </div>
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm p-6 border border-[#ede0d0] hover:border-[#8c4a35]/40 transition-all duration-300 hover:scale-105 hover:shadow-md">
                <div className="text-3xl font-bold text-[#8c4a35] mb-2">
                  {stats.today.missed}
                </div>
                <div className="text-[#7c6a5a] font-medium">Missed Today</div>
              </div>
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm p-6 border border-[#ede0d0] hover:border-[#8c4a35]/40 transition-all duration-300 hover:scale-105 hover:shadow-md">
                <div className="text-3xl font-bold text-[#4a2e1e] mb-2">
                  {stats.today.pending}
                </div>
                <div className="text-[#7c6a5a] font-medium">Pending</div>
              </div>
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm p-6 border border-[#ede0d0] hover:border-[#8c4a35]/40 transition-all duration-300 hover:scale-105 hover:shadow-md">
                <div className="text-3xl font-bold text-[#8c4a35] mb-2">
                  {stats.adherence7Days}%
                </div>
                <div className="text-[#7c6a5a] font-medium">7-Day Adherence</div>
              </div>
            </div>
          )}

          {/* Quick Info Cards */}
          {patient && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">👤</div>
                  <div>
                    <div className="text-sm text-[#7c6a5a]">Patient Info</div>
                    <div className="font-semibold text-[#4a2e1e]">{patient.name}</div>
                    <div className="text-xs text-[#8c7464]">{patient.age} years • {patient.gender}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">💊</div>
                  <div>
                    <div className="text-sm text-[#7c6a5a]">Total Medications</div>
                    <div className="font-semibold text-[#4a2e1e] text-xl">{stats?.totalMedications || 0}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">📊</div>
                  <div>
                    <div className="text-sm text-[#7c6a5a]">Overall Adherence</div>
                    <div className="font-semibold text-[#4a2e1e] text-xl">{stats?.adherence7Days || 0}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Today's Schedule */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
              <h2 className="text-2xl font-bold text-[#4a2e1e] mb-6">Today's Schedule</h2>
              {todayDoses.length === 0 ? (
                <div className="text-center py-12 text-[#7c6a5a]">
                  <div className="text-4xl mb-4">📅</div>
                  <p className="text-lg">No medications scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayDoses.map((dose) => (
                    <div
                      key={dose.id}
                      className={`border rounded-xl p-4 ${getStatusColor(dose.status)} backdrop-blur-sm`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-[#4a2e1e]">{dose.medication_name}</h3>
                          <p className="text-sm text-[#6e5d4f]">
                            {dose.strength} • {dose.dose_per_intake}
                          </p>
                          <p className="text-sm text-[#8c7464] mt-1">
                            {formatTime(dose.scheduled_time)} • {dose.time_slot}
                            {dose.food_rule && ` • ${dose.food_rule}`}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize ${
                          dose.status === 'taken' ? 'bg-[#ede0d0] text-[#5a3e2b]' :
                          dose.status === 'missed' ? 'bg-[#fbf0ea] text-[#8c4a35]' :
                          'bg-[#f5ebe1] text-[#6e4e37]'
                        }`}>
                          {dose.status}
                        </span>
                      </div>
                      {dose.status === 'pending' && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleMarkTaken(dose.id)}
                            className="flex-1 bg-[#8c4a35] hover:bg-[#723a28] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                          >
                            Mark as Taken
                          </button>
                          <button
                            onClick={() => handleMarkMissed(dose.id)}
                            className="flex-1 bg-[#ede0d0] hover:bg-[#dfcebc] text-[#5a3e2b] px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-[#d9c5b2]"
                          >
                            Mark as Missed
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Medications */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
              <h2 className="text-2xl font-bold text-[#4a2e1e] mb-6">My Medications</h2>
              {medications.length === 0 ? (
                <div className="text-center py-12 text-[#7c6a5a]">
                  <div className="text-4xl mb-4">💊</div>
                  <p className="text-lg">No medications added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medications.map((med) => (
                    <div
                      key={med.id}
                      className="border border-[#ede0d0] rounded-xl p-4 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-[#8c4a35]/40 hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-[#4a2e1e] text-lg">{med.name}</h3>
                      <p className="text-sm text-[#7c6a5a] mt-1">
                        {med.strength} • {med.dose_per_intake}
                      </p>
                      <p className="text-sm text-[#8c7464] mt-1">
                        Frequency: {med.frequency}
                      </p>
                      {med.time_slots && (
                        <p className="text-sm text-[#8c7464] mt-1">
                          Times: {med.time_slots}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Doses (Next 3 Days) */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
              <h2 className="text-xl font-bold text-[#4a2e1e] mb-4">Upcoming Doses</h2>
              <div className="space-y-3">
                {todayDoses
                  .filter(dose => dose.status === 'pending')
                  .slice(0, 3)
                  .map((dose) => (
                    <div key={dose.id} className="bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-[#ede0d0]">
                      <div className="font-semibold text-[#4a2e1e] text-sm">{dose.medication_name}</div>
                      <div className="text-xs text-[#7c6a5a] mt-1">
                        {formatTime(dose.scheduled_time)} • {dose.time_slot}
                      </div>
                    </div>
                  ))}
                {todayDoses.filter(dose => dose.status === 'pending').length === 0 && (
                  <div className="text-center py-6 text-[#7c6a5a] text-sm">
                    <div className="text-2xl mb-2">✅</div>
                    <p>All doses for today are completed!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Information */}
            {patient && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
                <h2 className="text-xl font-bold text-[#4a2e1e] mb-4">My Profile</h2>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-[#7c6a5a]">Name</div>
                    <div className="font-semibold text-[#4a2e1e]">{patient.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#7c6a5a]">Age</div>
                    <div className="font-semibold text-[#4a2e1e]">{patient.age} years</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#7c6a5a]">Gender</div>
                    <div className="font-semibold text-[#4a2e1e] capitalize">{patient.gender}</div>
                  </div>
                  {patient.relationship && (
                    <div>
                      <div className="text-xs text-[#7c6a5a]">Relationship</div>
                      <div className="font-semibold text-[#4a2e1e]">{patient.relationship}</div>
                    </div>
                  )}
                  {patient.allergies && (
                    <div>
                      <div className="text-xs text-[#7c6a5a]">Allergies</div>
                      <div className="font-semibold text-[#4a2e1e] text-sm">{patient.allergies}</div>
                    </div>
                  )}
                  {patient.emergency_contact && (
                    <div>
                      <div className="text-xs text-[#7c6a5a]">Emergency Contact</div>
                      <div className="font-semibold text-[#4a2e1e] text-sm">{patient.emergency_contact}</div>
                    </div>
                  )}
                  {patient.doctor_name && (
                    <div>
                      <div className="text-xs text-[#7c6a5a]">Doctor</div>
                      <div className="font-semibold text-[#4a2e1e] text-sm">{patient.doctor_name}</div>
                      {patient.doctor_contact && (
                        <div className="text-xs text-[#8c7464]">{patient.doctor_contact}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
              <h2 className="text-xl font-bold text-[#4a2e1e] mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const pendingDoses = todayDoses.filter(d => d.status === 'pending');
                    if (pendingDoses.length > 0) {
                      const nextDose = pendingDoses[0];
                      handleMarkTaken(nextDose.id);
                    } else {
                      alert('No pending doses to mark as taken');
                    }
                  }}
                  className="w-full bg-[#8c4a35] hover:bg-[#723a28] text-white px-4 py-3 rounded-xl transition-all shadow-sm hover:shadow-md font-semibold text-sm"
                >
                  Mark Next Dose as Taken
                </button>
                <div className="text-xs text-[#7c6a5a] text-center pt-2">
                  {todayDoses.filter(d => d.status === 'pending').length} pending dose(s) remaining
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity / Medication History */}
          <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
            <h2 className="text-2xl font-bold text-[#4a2e1e] mb-6">Recent Activity</h2>
            <div className="space-y-3">
              {todayDoses
                .filter(dose => dose.status === 'taken' || dose.status === 'missed')
                .slice(0, 5)
                .map((dose) => (
                  <div
                    key={dose.id}
                    className={`flex items-center justify-between p-4 rounded-xl border ${
                      dose.status === 'taken'
                        ? 'bg-[#f5ebe1] border-[#ede0d0]'
                        : 'bg-[#fbf0ea] border-[#ede0d0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl ${dose.status === 'taken' ? 'text-[#5a3e2b]' : 'text-[#8c4a35]'}`}>
                        {dose.status === 'taken' ? '✅' : '⚠️'}
                      </div>
                      <div>
                        <div className="font-semibold text-[#4a2e1e]">{dose.medication_name}</div>
                        <div className="text-sm text-[#7c6a5a]">
                          {formatTime(dose.scheduled_time)} • {dose.status === 'taken' ? 'Taken' : 'Missed'}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      dose.status === 'taken'
                        ? 'bg-[#ede0d0] text-[#5a3e2b]'
                        : 'bg-[#fbf0ea] text-[#8c4a35]'
                    }`}>
                      {dose.status === 'taken' ? 'Completed' : 'Missed'}
                    </span>
                  </div>
                ))}
              {todayDoses.filter(dose => dose.status === 'taken' || dose.status === 'missed').length === 0 && (
                <div className="text-center py-8 text-[#7c6a5a]">
                  <div className="text-3xl mb-2">📝</div>
                  <p>No activity recorded yet today</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PatientAuthGuard>
  );
}

