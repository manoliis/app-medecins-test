import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Doctor } from '../../../types';
import { Eye, EyeOff, Key, CreditCard, BarChart2 } from 'lucide-react';
import DoctorStats from './DoctorStats';
import DoctorCredentials from './DoctorCredentials';

interface DoctorManagementProps {
  doctors: Doctor[];
  onUpdateVisibility: (doctorId: number, visible: boolean) => void;
}

export default function DoctorManagement({ doctors, onUpdateVisibility }: DoctorManagementProps) {
  const { t } = useTranslation();
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const handleShowCredentials = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowCredentialsModal(true);
  };

  const handleShowStats = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowStatsModal(true);
  };

  const handleVisibilityToggle = (doctorId: number, currentVisibility: boolean) => {
    onUpdateVisibility(doctorId, !currentVisibility);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Médecin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Spécialité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {doctors.map(doctor => (
              <tr key={doctor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img 
                        className="h-10 w-10 rounded-full object-cover" 
                        src={doctor.image} 
                        alt={doctor.name} 
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {doctor.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {doctor.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{doctor.specialty}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doctor.subscription?.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <CreditCard className="w-3 h-3 mr-1" />
                      {doctor.subscription?.active ? 'Abonnement actif' : 'Abonnement inactif'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleShowStats(doctor)}
                      className="inline-flex items-center px-3 py-1.5 text-blue-600 hover:text-blue-900 transition-colors border border-blue-600 rounded-md hover:bg-blue-50"
                      title="Voir les statistiques"
                    >
                      <BarChart2 className="w-4 h-4 mr-1" />
                      Stats
                    </button>

                    <button
                      onClick={() => handleVisibilityToggle(doctor.id, doctor.approved)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-md transition-colors ${
                        doctor.approved 
                          ? 'text-red-600 hover:bg-red-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={doctor.approved ? 'Masquer de la plateforme' : 'Afficher sur la plateforme'}
                    >
                      {doctor.approved ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleShowCredentials(doctor)}
                      className="inline-flex items-center px-3 py-1.5 text-emerald-600 hover:text-emerald-900 transition-colors border border-emerald-600 rounded-md hover:bg-emerald-50"
                      title="Créer des identifiants"
                    >
                      <Key className="w-4 h-4 mr-1" />
                      Identifiants
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal pour les credentials */}
      {showCredentialsModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Créer des identifiants pour {selectedDoctor.name}
              </h3>
              <button
                onClick={() => setShowCredentialsModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            
            <DoctorCredentials 
              doctorId={selectedDoctor.id} 
              doctorName={selectedDoctor.name}
              onSuccess={() => setShowCredentialsModal(false)}
            />
          </div>
        </div>
      )}

      {/* Modal pour les statistiques */}
      {showStatsModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Statistiques de {selectedDoctor.name}
              </h3>
              <button
                onClick={() => setShowStatsModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            
            <DoctorStats doctor={selectedDoctor} />
          </div>
        </div>
      )}
    </div>
  );
}