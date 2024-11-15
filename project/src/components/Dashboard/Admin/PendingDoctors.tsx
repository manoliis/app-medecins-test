import React from 'react';
import { useTranslation } from 'react-i18next';
import { Doctor } from '../../../types';
import { Check, X } from 'lucide-react';

interface PendingDoctorsProps {
  doctors: Doctor[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export default function PendingDoctors({ doctors, onApprove, onReject }: PendingDoctorsProps) {
  const { t } = useTranslation();

  if (doctors.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {t('admin.noPendingDoctors')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">{t('admin.pendingApprovals')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doctor => (
          <div key={doctor.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium">{doctor.name}</h4>
                  <p className="text-sm text-gray-500">{doctor.specialty}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">{t('admin.location')}:</span> {doctor.location}
                </p>
                <p className="text-sm">
                  <span className="font-medium">{t('admin.languages')}:</span>{' '}
                  {doctor.languages.join(', ')}
                </p>
                <p className="text-sm">
                  <span className="font-medium">{t('admin.submittedAt')}:</span>{' '}
                  {new Date(doctor.submittedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => onReject(doctor.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  {t('admin.reject')}
                </button>
                <button
                  onClick={() => onApprove(doctor.id)}
                  className="inline-flex items-center px-3 py-1.5 text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
                >
                  <Check className="w-4 h-4 mr-1" />
                  {t('admin.approve')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}