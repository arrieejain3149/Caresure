'use client';

import AuthGuard from '@/components/AuthGuard';

export default function AboutPage() {
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
        <h1 className="text-4xl font-bold text-[#4a2e1e] mb-8 drop-shadow-sm">
          About CareSure
        </h1>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-[#4a2e1e] mb-4">Our Mission</h2>
            <p className="text-[#6e5d4f] leading-relaxed">
              CareSure is a smart medication management system designed to help caregivers stay 
              informed while ensuring elders stay safe. We understand the challenges of managing 
              medications for loved ones, and our platform provides the tools and peace of mind 
              you need.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#4a2e1e] mb-4">Key Features</h2>
            <ul className="space-y-3 text-[#6e5d4f]">
              <li className="flex items-start">
                <span className="text-[#8c4a35] mr-2">•</span>
                <span><strong>Patient Management:</strong> Easily add and manage patient profiles with essential medical information.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8c4a35] mr-2">•</span>
                <span><strong>Medication Tracking:</strong> Keep track of all medications, dosages, and schedules in one place.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8c4a35] mr-2">•</span>
                <span><strong>Smart Reminders:</strong> Automated reminders ensure medications are taken on time.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8c4a35] mr-2">•</span>
                <span><strong>Real-time Alerts:</strong> Get instant notifications about missed doses, low medication supplies, and important health events.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8c4a35] mr-2">•</span>
                <span><strong>Medical Records:</strong> Store and access medical cards, documents, and health reports securely.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8c4a35] mr-2">•</span>
                <span><strong>Comprehensive Reports:</strong> Generate detailed reports on medication adherence and health trends.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#4a2e1e] mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="p-4 bg-[#f5ebe1] rounded-xl border border-[#ede0d0]">
                <h3 className="font-semibold text-[#4a2e1e] mb-2">1. Create Patient Profiles</h3>
                <p className="text-[#6e5d4f]">Add your loved ones as patients with their basic information and medical history.</p>
              </div>
              <div className="p-4 bg-[#fbf0ea] rounded-xl border border-[#ede0d0]">
                <h3 className="font-semibold text-[#4a2e1e] mb-2">2. Add Medications</h3>
                <p className="text-[#6e5d4f]">Input all medications with dosages, frequencies, and special instructions.</p>
              </div>
              <div className="p-4 bg-[#ede0d0] rounded-xl border border-[#d9c5b2]">
                <h3 className="font-semibold text-[#4a2e1e] mb-2">3. Set Up Reminders</h3>
                <p className="text-[#6e5d4f]">Configure automated reminders to ensure medications are taken on schedule.</p>
              </div>
              <div className="p-4 bg-[#faf6f0] rounded-xl border border-[#ede0d0]">
                <h3 className="font-semibold text-[#4a2e1e] mb-2">4. Monitor & Respond</h3>
                <p className="text-[#6e5d4f]">Stay informed through real-time alerts and track medication adherence through comprehensive reports.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#4a2e1e] mb-4">Why CareSure?</h2>
            <p className="text-[#6e5d4f] leading-relaxed">
              Managing medications for elderly loved ones can be overwhelming. CareSure simplifies 
              this process by providing a centralized platform where caregivers can monitor medication 
              schedules, receive timely alerts, and maintain comprehensive health records. Our goal is 
              to give you peace of mind while ensuring the safety and well-being of those you care for.
            </p>
          </section>

          <section className="pt-6 border-t border-[#ede0d0]">
            <h2 className="text-2xl font-semibold text-[#4a2e1e] mb-4">Contact & Support</h2>
            <p className="text-[#6e5d4f]">
              If you have any questions or need assistance, please visit the Settings page to access 
              support options or contact our team.
            </p>
          </section>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}

