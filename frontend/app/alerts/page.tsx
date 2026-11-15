'use client';

import { useEffect, useState } from 'react';
import { alertAPI } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';

interface Alert {
  id: number;
  alert_type: string;
  title: string;
  message: string;
  severity: string;
  patient_name: string;
  is_read: boolean;
  created_at: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, [filter]);

  const loadAlerts = async () => {
    try {
      const params: any = {};
      if (filter !== 'all') {
        if (filter === 'unread') {
          params.is_read = 'false';
        } else {
          params.type = filter;
        }
      }
      const response = await alertAPI.getAll(params);
      setAlerts(response.data.alerts || []);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await alertAPI.markRead(id.toString());
      loadAlerts();
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await alertAPI.markAllRead();
      loadAlerts();
    } catch (error) {
      console.error('Failed to mark all alerts as read:', error);
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-[#8c4a35] bg-[#fbf0ea]';
      case 'medium':
        return 'border-[#a65d46] bg-[#f5ebe1]';
      default:
        return 'border-[#c7b4a2] bg-[#faf6f0]';
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#4a2e1e] drop-shadow-sm">
            Alerts
          </h1>
          <button
            onClick={markAllAsRead}
            className="bg-[#8c4a35] hover:bg-[#723a28] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md backdrop-blur-sm"
          >
            Mark All as Read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] mb-6">
          <div className="flex border-b border-[#ede0d0]">
            {['all', 'unread', 'missed_dose', 'low_stock', 'low_battery'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  filter === tab
                    ? 'border-b-2 border-[#8c4a35] text-[#8c4a35] bg-[#f5ebe1]/60'
                    : 'text-[#7c6a5a] hover:text-[#4a2e1e]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-12 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <h2 className="text-2xl font-semibold text-[#4a2e1e] mb-2">No alerts</h2>
              <p className="text-[#7c6a5a]">You're all caught up!</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border-l-4 p-6 ${getSeverityColor(alert.severity)} ${
                  !alert.is_read ? 'ring-2 ring-[#8c4a35]/40' : ''
                } border border-[#ede0d0] hover:border-[#8c4a35]/40 hover:shadow-md transition-all`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[#4a2e1e]">{alert.title}</h3>
                      {!alert.is_read && (
                        <span className="bg-[#8c4a35] text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-[#6e5d4f] mb-2">{alert.message}</p>
                    <div className="text-sm text-[#8c7464]">
                      {alert.patient_name} • {new Date(alert.created_at).toLocaleString()}
                    </div>
                  </div>
                  {!alert.is_read && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="ml-4 text-[#8c4a35] hover:text-[#5a2e1e] text-sm font-medium transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}

