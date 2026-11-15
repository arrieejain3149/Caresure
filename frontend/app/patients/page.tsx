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
        <div className="min-h-screen flex items-center justify-center bg-[#faf6f0]">
          <div className="text-[#8c4a35] font-medium">Loading...</div>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#4a2e1e] drop-shadow-sm">
            Patients
          </h1>
          <Link
            href="/patients/add"
            className="bg-[#8c4a35] hover:bg-[#723a28] text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg transition-all shadow-sm hover:shadow-md font-medium min-h-[44px] flex items-center justify-center touch-manipulation active:scale-95 w-full sm:w-auto"
          >
            <span className="sm:hidden">➕ </span>
            <span>Add New Patient</span>
          </Link>
        </div>

        {patients.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-12 text-center">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-semibold text-[#4a2e1e] mb-2">No patients yet</h2>
            <p className="text-[#7c6a5a] mb-6">
              Start by adding your first patient to manage their medications
            </p>
            <Link
              href="/patients/add"
              className="inline-block bg-[#8c4a35] hover:bg-[#723a28] text-white px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md font-medium"
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
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-4 sm:p-6 hover:border-[#8c4a35]/40 hover:shadow-md transition-all duration-300 active:scale-95 touch-manipulation"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#4a2e1e]">{patient.name}</h3>
                    <p className="text-[#7c6a5a]">
                      {patient.age} years old • {patient.gender}
                    </p>
                  </div>
                </div>
                <div className="border-t border-[#ede0d0] pt-4 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7c6a5a]">Medications:</span>
                    <span className="font-semibold text-[#4a2e1e]">{patient.medication_count || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-[#7c6a5a]">Today Taken:</span>
                    <span className="text-[#5a3e2b] font-semibold">{patient.today_taken || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-[#7c6a5a]">Today Missed:</span>
                    <span className="text-[#8c4a35] font-semibold">{patient.today_missed || 0}</span>
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

