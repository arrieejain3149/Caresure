'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { deviceAPI } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';

interface Device {
  id: number;
  device_id: string;
  device_name: string;
  connection_type: string;
  is_connected: boolean;
  battery_level: number;
  last_sync: string;
  compartments: Array<{
    id: number;
    compartment_number: number;
    medication_id: number;
    medication_name: string;
  }>;
  recent_events: Array<{
    id: number;
    event_type: string;
    description: string;
    timestamp: string;
  }>;
}

export default function PatientDevicePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDevice();
  }, [patientId]);

  const loadDevice = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await deviceAPI.getByPatient(patientId);
      setDevice(response.data.device);
    } catch (err: any) {
      console.error('Failed to load device:', err);
      setError(err.response?.data?.error || 'Failed to load device information');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-[#8c4a35] hover:text-[#5a2e1e] mb-4 font-semibold transition-colors hover:bg-white/50 px-3 py-1 rounded-lg backdrop-blur-sm"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold text-[#4a2e1e] drop-shadow-sm">
              Device Management
            </h1>
          </div>

          {error && (
            <div className="bg-[#fbf0ea] border border-[#ede0d0] text-[#8c4a35] px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-[#8c4a35]">Loading...</div>
          ) : !device ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-12 text-center">
              <div className="text-6xl mb-6">📱</div>
              <h2 className="text-2xl font-bold text-[#4a2e1e] mb-4">No Device Connected</h2>
              <p className="text-[#7c6a5a] mb-6">Connect a medication reminder device to get started</p>
              <Link
                href={`/patients/${patientId}/device/connect`}
                className="inline-block bg-[#8c4a35] hover:bg-[#723a28] text-white px-8 py-3 rounded-xl transition-all shadow-sm hover:shadow-md font-semibold"
              >
                Connect Device
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Device Status Card */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
                <h2 className="text-2xl font-bold text-[#4a2e1e] mb-6">Device Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-[#ede0d0]">
                    <div className="text-sm text-[#7c6a5a] mb-1">Device Name</div>
                    <div className="font-semibold text-[#4a2e1e] text-lg">{device.device_name || 'Unnamed Device'}</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-[#ede0d0]">
                    <div className="text-sm text-[#7c6a5a] mb-1">Connection Status</div>
                    <div className="font-semibold text-[#4a2e1e] text-lg">
                      {device.is_connected ? (
                        <span className="text-[#5a3e2b]">Connected</span>
                      ) : (
                        <span className="text-[#8c4a35]">Disconnected</span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-[#ede0d0]">
                    <div className="text-sm text-[#7c6a5a] mb-1">Battery Level</div>
                    <div className="font-semibold text-[#4a2e1e] text-lg">{device.battery_level || 0}%</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-[#ede0d0]">
                    <div className="text-sm text-[#7c6a5a] mb-1">Last Sync</div>
                    <div className="font-semibold text-[#4a2e1e] text-sm">{formatDate(device.last_sync)}</div>
                  </div>
                </div>
              </div>

              {/* Compartments */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
                <h2 className="text-2xl font-bold text-[#4a2e1e] mb-6">Compartments</h2>
                {device.compartments && device.compartments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {device.compartments.map((comp) => (
                      <div
                        key={comp.id}
                        className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-[#ede0d0] hover:border-[#8c4a35]/40 hover:shadow-md transition-all"
                      >
                        <div className="text-sm text-[#7c6a5a] mb-1">Compartment {comp.compartment_number}</div>
                        <div className="font-semibold text-[#4a2e1e]">
                          {comp.medication_name || 'Empty'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#7c6a5a]">
                    <p>No compartments assigned</p>
                  </div>
                )}
              </div>

              {/* Recent Events */}
              {device.recent_events && device.recent_events.length > 0 && (
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6">
                  <h2 className="text-2xl font-bold text-[#4a2e1e] mb-6">Recent Events</h2>
                  <div className="space-y-3">
                    {device.recent_events.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-[#ede0d0]"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-[#4a2e1e]">{event.event_type}</div>
                            <div className="text-sm text-[#6e5d4f] mt-1">{event.description}</div>
                          </div>
                          <div className="text-xs text-[#8c7464]">{formatDate(event.timestamp)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <Link
                  href={`/patients/${patientId}/device/connect`}
                  className="bg-[#8c4a35] hover:bg-[#723a28] text-white px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md font-semibold"
                >
                  Update Device
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

