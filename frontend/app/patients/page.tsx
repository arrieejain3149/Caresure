'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { patientAPI } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  medication_count: number;
  today_taken: number;
  today_missed: number;
}

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await patientAPI.getAll();
      setPatients(response.data.patients || []);
    } catch (error) {
      console.error('Failed to load patients:', error);
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-rose-500 to-violet-600 bg-clip-text text-transparent drop-shadow-sm">
            Patients
          </h1>
          <Link
            href="/patients/add"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-orange-500/50 font-medium backdrop-blur-sm min-h-[44px] flex items-center justify-center touch-manipulation active:scale-95 w-full sm:w-auto"
          >
            <span className="sm:hidden">➕ </span>
            <span>Add New Patient</span>
          </Link>
        </div>

        {patients.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-orange-200/50 p-12 text-center">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-semibold text-amber-900 mb-2">No patients yet</h2>
            <p className="text-amber-700/70 mb-6">
              Start by adding your first patient to manage their medications
            </p>
            <Link
              href="/patients/add"
              className="inline-block bg-gradient-to-r from-violet-500 to-violet-600 text-white px-6 py-3 rounded-lg hover:from-violet-600 hover:to-violet-700 transition-all shadow-lg font-medium backdrop-blur-sm"
            >
              Add Patient
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {patients.map((patient) => (
              <Link
                key={patient.id}
                href={`/patients/${patient.id}`}
                className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-orange-200/50 p-4 sm:p-6 hover:border-violet-400 hover:shadow-2xl transition-all duration-300 active:scale-95 touch-manipulation"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-amber-900">{patient.name}</h3>
                    <p className="text-amber-700/70">
                      {patient.age} years old • {patient.gender}
                    </p>
                  </div>
                </div>
                <div className="border-t border-orange-200/50 pt-4 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-700/70">Medications:</span>
                    <span className="font-semibold text-violet-600">{patient.medication_count || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-amber-700/70">Today Taken:</span>
                    <span className="text-emerald-600 font-semibold">{patient.today_taken || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-amber-700/70">Today Missed:</span>
                    <span className="text-orange-600 font-semibold">{patient.today_missed || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    </AuthGuard>
  );
}

