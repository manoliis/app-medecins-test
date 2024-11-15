import React, { useState } from 'react';
import { Doctor, AnalyticsEvent } from '../types';
import { useTranslation } from 'react-i18next';
import DoctorCard from './DoctorCard';
import BulkImport from './Admin/BulkImport';
import DoctorReport from './Admin/DoctorReport';
import { BarChart3, Users, UserPlus } from 'lucide-react';

interface AdminPanelProps {
  doctors: Doctor[];
  pendingDoctors: Doctor[];
  onApprovePending: (id: number) => void;
  onRejectPending: (id: number) => void;
  onBulkImport: (doctors: Partial<Doctor>[]) => void;
}

export default function AdminPanel({
  doctors,
  pendingDoctors,
  onApprovePending,
  onRejectPending,
  onBulkImport,
}: AdminPanelProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'analytics' | 'pending' | 'import'>('analytics');

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="border-b">
        <nav className="flex space-x-4 px-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'analytics'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('admin.tabs.analytics')}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'pending'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t('admin.tabs.pending')}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'import'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              {t('admin.tabs.import')}
            </div>
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <DoctorReport doctors={doctors} />
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{t('admin.pending.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingDoctors.map(doctor => (
                <div key={doctor.id} className="border rounded-lg p-4">
                  <DoctorCard {...doctor} isPreview />
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => onRejectPending(doctor.id)}
                      className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                    >
                      {t('admin.pending.reject')}
                    </button>
                    <button
                      onClick={() => onApprovePending(doctor.id)}
                      className="px-3 py-1 text-sm text-white bg-emerald-600 rounded hover:bg-emerald-700"
                    >
                      {t('admin.pending.approve')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <BulkImport onImport={onBulkImport} />
        )}
      </div>
    </div>
  );
}