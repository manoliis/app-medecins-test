import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../config/stripe';
import { Doctor } from '../../types';
import DoctorCard from '../DoctorCard';
import SubscriptionManager from './SubscriptionManager';
import BulkImport from './BulkImport';
import Analytics from './Analytics';

interface AdminPanelProps {
  doctors: Doctor[];
  pendingDoctors: Doctor[];
  onApprovePending: (id: number) => void;
  onRejectPending: (id: number) => void;
  onBulkImport: (doctors: Partial<Doctor>[]) => void;
  onUpdateSubscription: (doctorId: number, isActive: boolean) => void;
}

export default function AdminPanel({
  doctors,
  pendingDoctors,
  onApprovePending,
  onRejectPending,
  onBulkImport,
  onUpdateSubscription,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'pending' | 'subscriptions' | 'import'>('analytics');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="border-b">
        <nav className="flex space-x-4 px-6" aria-label="Tabs">
          {['analytics', 'pending', 'subscriptions', 'import'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'analytics' && (
          <Analytics doctors={doctors} />
        )}

        {activeTab === 'pending' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Pending Approvals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingDoctors.map(doctor => (
                <div key={doctor.id} className="border rounded-lg p-4">
                  <DoctorCard {...doctor} isPreview />
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => onRejectPending(doctor.id)}
                      className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => onApprovePending(doctor.id)}
                      className="px-3 py-1 text-sm text-white bg-emerald-600 rounded hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <Elements stripe={stripePromise}>
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Manage Subscriptions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map(doctor => (
                  <div key={doctor.id} className="border rounded-lg p-4">
                    <DoctorCard {...doctor} isPreview />
                    <div className="mt-4">
                      <SubscriptionManager
                        doctor={doctor}
                        onUpdateSubscription={onUpdateSubscription}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Elements>
        )}

        {activeTab === 'import' && (
          <BulkImport onBulkImport={onBulkImport} />
        )}
      </div>
    </div>
  );
}