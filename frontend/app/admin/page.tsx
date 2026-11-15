'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/AdminGuard';
import { adminAPI } from '@/lib/api';

interface Stats {
  totalCaregivers: number;
  totalPatients: number;
  activeMedications: number;
  unreadAlerts: number;
}

interface Caregiver {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  caregiver_name: string;
  caregiver_email: string;
  created_at: string;
}

interface Medication {
  id: number;
  name: string;
  strength: string;
  patient_name: string;
  caregiver_name: string;
  is_active: boolean;
}

interface Alert {
  id: number;
  alert_type: string;
  title: string;
  severity: string;
  patient_name: string;
  is_read: boolean;
  created_at: string;
}

interface Activity {
  id: number;
  name: string;
  email: string;
  last_activity: string;
  activity_type: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'caregivers' | 'patients' | 'medications' | 'alerts' | 'activity'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [statsRes, caregiversRes, patientsRes, medicationsRes, alertsRes, activityRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getCaregivers(),
        adminAPI.getPatients(),
        adminAPI.getMedications(),
        adminAPI.getAlerts(),
        adminAPI.getLoginActivity(),
      ]);

      setStats(statsRes.data.stats);
      setCaregivers(caregiversRes.data.caregivers || []);
      setPatients(patientsRes.data.patients || []);
      setMedications(medicationsRes.data.medications || []);
      setAlerts(alertsRes.data.alerts || []);
      setActivity(activityRes.data.activity || []);
    } catch (error: any) {
      console.error('Failed to load admin data:', error);
      
      // Handle 403 Forbidden error
      if (error.response?.status === 403) {
        setError('Access Denied: You do not have admin privileges. Please contact the administrator to grant admin access to your account.');
      } else if (error.response?.status === 401) {
        setError('Authentication required: Please log in again.');
      } else {
        setError(`Failed to load admin data: ${error.response?.data?.error || error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen flex items-center justify-center bg-[#faf6f0]">
          <div className="text-[#8c4a35]">Loading admin data...</div>
        </div>
      </AdminGuard>
    );
  }

  if (error) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-[#faf6f0] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#fbf0ea] border border-[#ede0d0] rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-[#8c4a35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-[#8c4a35] mb-2">Access Error</h2>
                  <p className="text-[#4a2e1e] mb-4">{error}</p>
                  {error.includes('403') || error.includes('Access Denied') ? (
                    <div className="bg-white/60 rounded-lg p-4 mt-4 border border-[#ede0d0]">
                      <p className="text-[#7c6a5a] text-sm mb-2">
                        <strong>To gain admin access:</strong>
                      </p>
                      <ul className="text-[#7c6a5a] text-sm space-y-1 list-disc list-inside">
                        <li>Your email must be added to the admin list in the backend</li>
                        <li>Default admin emails: admin@jklu.edu.in, admin@caresure.com</li>
                        <li>Or set ADMIN_EMAILS environment variable in backend</li>
                        <li>Contact your system administrator to add your email</li>
                      </ul>
                    </div>
                  ) : null}
                  <button
                    onClick={() => {
                      setError(null);
                      setLoading(true);
                      loadData();
                    }}
                    className="mt-4 px-4 py-2 bg-[#8c4a35] hover:bg-[#723a28] text-white rounded-lg transition-colors font-semibold"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#faf6f0] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#4a2e1e] mb-8">
            Admin Panel
          </h1>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 rounded-xl shadow-sm p-6 border border-[#ede0d0]">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-[#f5ebe1] rounded-lg">
                    <svg className="w-6 h-6 text-[#8c4a35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#4a2e1e] mb-1">{stats.totalCaregivers}</div>
                <div className="text-[#7c6a5a]">Total Caregivers</div>
              </div>

              <div className="bg-white/80 rounded-xl shadow-sm p-6 border border-[#ede0d0]">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-[#f5ebe1] rounded-lg">
                    <svg className="w-6 h-6 text-[#8c4a35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#4a2e1e] mb-1">{stats.totalPatients}</div>
                <div className="text-[#7c6a5a]">Total Patients</div>
              </div>

              <div className="bg-white/80 rounded-xl shadow-sm p-6 border border-[#ede0d0]">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-[#f5ebe1] rounded-lg">
                    <svg className="w-6 h-6 text-[#8c4a35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#4a2e1e] mb-1">{stats.activeMedications}</div>
                <div className="text-[#7c6a5a]">Active Medications</div>
              </div>

              <div className="bg-white/80 rounded-xl shadow-sm p-6 border border-[#ede0d0]">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-[#fbf0ea] rounded-lg">
                    <svg className="w-6 h-6 text-[#8c4a35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#4a2e1e] mb-1">{stats.unreadAlerts}</div>
                <div className="text-[#7c6a5a]">Unread Alerts</div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white/80 rounded-xl shadow-sm border border-[#ede0d0] mb-6">
            <div className="flex border-b border-[#ede0d0] overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'caregivers', label: 'Caregivers' },
                { id: 'patients', label: 'Patients' },
                { id: 'medications', label: 'Medications' },
                { id: 'alerts', label: 'Alerts' },
                { id: 'activity', label: 'Login Activity' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-2 border-[#8c4a35] text-[#8c4a35] bg-[#f5ebe1]/60'
                      : 'text-[#7c6a5a] hover:text-[#4a2e1e]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white/80 rounded-xl shadow-sm border border-[#ede0d0] p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-[#4a2e1e] mb-4">System Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#faf6f0] rounded-lg p-4 border border-[#ede0d0]">
                      <h3 className="text-lg font-semibold text-[#4a2e1e] mb-2">Recent Activity</h3>
                      <p className="text-[#7c6a5a] text-sm">Last 24 hours activity summary</p>
                    </div>
                    <div className="bg-[#faf6f0] rounded-lg p-4 border border-[#ede0d0]">
                      <h3 className="text-lg font-semibold text-[#4a2e1e] mb-2">Privacy Notice</h3>
                      <p className="text-[#7c6a5a] text-sm">All sensitive data is masked for privacy protection</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'caregivers' && (
              <div>
                <h2 className="text-2xl font-semibold text-[#4a2e1e] mb-4">Caregivers ({caregivers.length})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#ede0d0]">
                        <th className="pb-3 text-[#4a2e1e] font-semibold">ID</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Name</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Email</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Phone</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {caregivers.map((cg) => (
                        <tr key={cg.id} className="border-b border-[#ede0d0]/50 hover:bg-[#faf6f0]">
                          <td className="py-3 text-[#7c6a5a]">{cg.id}</td>
                          <td className="py-3 text-[#4a2e1e] font-medium">{cg.name}</td>
                          <td className="py-3 text-[#7c6a5a]">{cg.email}</td>
                          <td className="py-3 text-[#7c6a5a]">{cg.phone}</td>
                          <td className="py-3 text-[#7c6a5a]">{new Date(cg.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'patients' && (
              <div>
                <h2 className="text-2xl font-semibold text-[#4a2e1e] mb-4">Patients ({patients.length})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#ede0d0]">
                        <th className="pb-3 text-[#4a2e1e] font-semibold">ID</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Name</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Age</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Gender</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Caregiver</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((p) => (
                        <tr key={p.id} className="border-b border-[#ede0d0]/50 hover:bg-[#faf6f0]">
                          <td className="py-3 text-[#7c6a5a]">{p.id}</td>
                          <td className="py-3 text-[#4a2e1e] font-medium">{p.name}</td>
                          <td className="py-3 text-[#7c6a5a]">{p.age || 'N/A'}</td>
                          <td className="py-3 text-[#7c6a5a]">{p.gender || 'N/A'}</td>
                          <td className="py-3 text-[#7c6a5a]">{p.caregiver_name}</td>
                          <td className="py-3 text-[#7c6a5a]">{new Date(p.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'medications' && (
              <div>
                <h2 className="text-2xl font-semibold text-[#4a2e1e] mb-4">Medications ({medications.length})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#ede0d0]">
                        <th className="pb-3 text-[#4a2e1e] font-semibold">ID</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Name</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Strength</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Patient</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Caregiver</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medications.map((m) => (
                        <tr key={m.id} className="border-b border-[#ede0d0]/50 hover:bg-[#faf6f0]">
                          <td className="py-3 text-[#7c6a5a]">{m.id}</td>
                          <td className="py-3 text-[#4a2e1e] font-medium">{m.name}</td>
                          <td className="py-3 text-[#7c6a5a]">{m.strength || 'N/A'}</td>
                          <td className="py-3 text-[#7c6a5a]">{m.patient_name}</td>
                          <td className="py-3 text-[#7c6a5a]">{m.caregiver_name}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${m.is_active ? 'bg-[#ede0d0] text-[#5a3e2b]' : 'bg-[#fbf0ea] text-[#8c4a35]'}`}>
                              {m.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div>
                <h2 className="text-2xl font-semibold text-[#4a2e1e] mb-4">Alerts ({alerts.length})</h2>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        alert.severity === 'high'
                          ? 'border-[#8c4a35] bg-[#fbf0ea]'
                          : alert.severity === 'medium'
                          ? 'border-[#a65d46] bg-[#f5ebe1]'
                          : 'border-[#c7b4a2] bg-[#faf6f0]'
                      } border border-[#ede0d0]`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-[#4a2e1e]">{alert.title}</div>
                          <div className="text-sm text-[#7c6a5a] mt-1">
                            {alert.patient_name} • {new Date(alert.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            alert.severity === 'high' ? 'bg-[#fbf0ea] text-[#8c4a35]' :
                            alert.severity === 'medium' ? 'bg-[#f5ebe1] text-[#a65d46]' :
                            'bg-[#ede0d0] text-[#5a3e2b]'
                          }`}>
                            {alert.severity}
                          </span>
                          {!alert.is_read && (
                            <span className="px-2 py-1 rounded text-xs bg-[#8c4a35] text-white">
                              Unread
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <h2 className="text-2xl font-semibold text-[#4a2e1e] mb-4">Login Activity ({activity.length})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#ede0d0]">
                        <th className="pb-3 text-[#4a2e1e] font-semibold">ID</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Name</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Email</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Activity</th>
                        <th className="pb-3 text-[#4a2e1e] font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activity.map((a) => (
                        <tr key={a.id} className="border-b border-[#ede0d0]/50 hover:bg-[#faf6f0]">
                          <td className="py-3 text-[#7c6a5a]">{a.id}</td>
                          <td className="py-3 text-[#4a2e1e] font-medium">{a.name}</td>
                          <td className="py-3 text-[#7c6a5a]">{a.email}</td>
                          <td className="py-3 text-[#7c6a5a] capitalize">{a.activity_type}</td>
                          <td className="py-3 text-[#7c6a5a]">{new Date(a.last_activity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}

