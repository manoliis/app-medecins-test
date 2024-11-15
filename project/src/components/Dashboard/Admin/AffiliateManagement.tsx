import React, { useState } from 'react';
import { AffiliateStats } from '../../../types/auth';
import { Users, DollarSign, TrendingUp, UserPlus } from 'lucide-react';

export default function AffiliateManagement() {
  const [affiliates, setAffiliates] = useState<AffiliateStats[]>(() => {
    const savedAffiliates = localStorage.getItem('affiliates');
    return savedAffiliates ? JSON.parse(savedAffiliates) : [];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAffiliate, setNewAffiliate] = useState({
    email: '',
    name: '',
    password: ''
  });

  const totalEarnings = affiliates.reduce((sum, aff) => sum + aff.totalEarnings, 0);
  const monthlyEarnings = affiliates.reduce((sum, aff) => sum + aff.monthlyEarnings, 0);
  const activeAffiliates = affiliates.filter(aff => aff.status === 'active').length;

  const handleAddAffiliate = () => {
    const affiliate: AffiliateStats = {
      id: `aff${Date.now()}`,
      name: newAffiliate.name,
      email: newAffiliate.email,
      totalEarnings: 0,
      monthlyEarnings: 0,
      referredDoctors: 0,
      activeReferrals: 0,
      joinDate: new Date().toISOString(),
      status: 'active'
    };

    const updatedAffiliates = [...affiliates, affiliate];
    setAffiliates(updatedAffiliates);
    localStorage.setItem('affiliates', JSON.stringify(updatedAffiliates));
    setShowAddForm(false);
    setNewAffiliate({ email: '', name: '', password: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des Affiliés</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Ajouter un affilié
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Affiliés actifs</p>
              <p className="text-2xl font-bold">{activeAffiliates}</p>
            </div>
            <Users className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenus mensuels</p>
              <p className="text-2xl font-bold">{monthlyEarnings.toFixed(2)}€</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenus totaux</p>
              <p className="text-2xl font-bold">{totalEarnings.toFixed(2)}€</p>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Ajouter un affilié</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={newAffiliate.name}
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={newAffiliate.email}
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  type="password"
                  value={newAffiliate.password}
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddAffiliate}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Affilié
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Médecins référés
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actifs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gains mensuels
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gains totaux
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {affiliates.map((affiliate) => (
              <tr key={affiliate.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {affiliate.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {affiliate.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {affiliate.referredDoctors}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {affiliate.activeReferrals}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {affiliate.monthlyEarnings.toFixed(2)}€
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {affiliate.totalEarnings.toFixed(2)}€
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    affiliate.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {affiliate.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}