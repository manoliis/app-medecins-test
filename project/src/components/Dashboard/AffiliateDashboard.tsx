import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Home, Gift, TrendingUp, Users, DollarSign, Share2 } from 'lucide-react';
import { Doctor } from '../../types';

interface ReferredDoctor extends Doctor {
  status: 'pending' | 'active' | 'inactive';
  earnings: {
    monthly: number;
    total: number;
  };
}

export default function AffiliateDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [referredDoctors, setReferredDoctors] = useState<ReferredDoctor[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    // Générer le lien de parrainage
    setReferralLink(`https://example.com/register?ref=${user?.id}`);

    // Charger les médecins parrainés
    const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    const referred = doctors
      .filter((doc: Doctor) => doc.referredBy === user?.id)
      .map((doc: Doctor) => ({
        ...doc,
        status: doc.subscription?.active ? 'active' : 'inactive',
        earnings: {
          monthly: doc.subscription?.plan === 'monthly' ? 49 * 0.2 : 499 * 0.2 / 12,
          total: calculateTotalEarnings(doc)
        }
      }));

    setReferredDoctors(referred);

    // Calculer les gains
    const monthly = referred.reduce((acc, doc) => acc + doc.earnings.monthly, 0);
    const total = referred.reduce((acc, doc) => acc + doc.earnings.total, 0);

    setMonthlyEarnings(monthly);
    setTotalEarnings(total);
  }, [user?.id]);

  const calculateTotalEarnings = (doctor: Doctor) => {
    if (!doctor.subscription?.active) return 0;
    const startDate = new Date(doctor.subscription.startDate);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - startDate.getFullYear()) * 12 + 
                      (now.getMonth() - startDate.getMonth());
    
    return doctor.subscription.plan === 'monthly'
      ? monthsDiff * (49 * 0.2)
      : monthsDiff * (499 * 0.2 / 12);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Lien de parrainage copié !');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Programme Ambassadeur
          </h1>
          <p className="text-gray-600 mt-1">
            Gagnez 20% sur chaque abonnement de médecin parrainé
          </p>
        </div>
        <button 
          onClick={handleHomeClick}
          className="flex items-center px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100"
        >
          <Home className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </button>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Gains mensuels</p>
              <p className="text-2xl font-bold text-emerald-600">
                {monthlyEarnings.toFixed(2)}€
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Gains totaux</p>
              <p className="text-2xl font-bold text-emerald-600">
                {totalEarnings.toFixed(2)}€
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Médecins actifs</p>
              <p className="text-2xl font-bold">
                {referredDoctors.filter(d => d.status === 'active').length}
              </p>
            </div>
            <Users className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Taux de conversion</p>
              <p className="text-2xl font-bold">
                {referredDoctors.length > 0
                  ? ((referredDoctors.filter(d => d.status === 'active').length / referredDoctors.length) * 100).toFixed(0)
                  : 0}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Lien de parrainage */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-2">Votre lien de parrainage</h3>
            <p className="text-gray-500">Partagez ce lien avec les médecins pour gagner 20% sur leurs abonnements</p>
          </div>
          <button
            onClick={copyReferralLink}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Copier le lien
          </button>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg font-mono text-sm">
          {referralLink}
        </div>
      </div>

      <Tabs defaultValue="doctors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="doctors">
            <Users className="w-4 h-4 mr-2" />
            Médecins parrainés
          </TabsTrigger>
          <TabsTrigger value="earnings">
            <Gift className="w-4 h-4 mr-2" />
            Détails des gains
          </TabsTrigger>
        </TabsList>

        <TabsContent value="doctors">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Médecin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gains mensuels
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gains totaux
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referredDoctors.map(doctor => (
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
                            Dr. {doctor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {doctor.specialty}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        doctor.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {doctor.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doctor.subscription?.startDate || doctor.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doctor.earnings.monthly.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doctor.earnings.total.toFixed(2)}€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="earnings">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Comment ça marche ?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3">
                      1
                    </div>
                    <h4 className="font-medium">Parrainez des médecins</h4>
                  </div>
                  <p className="text-gray-600">
                    Partagez votre lien unique avec des médecins intéressés par notre plateforme
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3">
                      2
                    </div>
                    <h4 className="font-medium">Ils s'abonnent</h4>
                  </div>
                  <p className="text-gray-600">
                    Les médecins choisissent leur abonnement (mensuel ou annuel)
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3">
                      3
                    </div>
                    <h4 className="font-medium">Vous gagnez</h4>
                  </div>
                  <p className="text-gray-600">
                    Recevez 20% de commission sur chaque abonnement, chaque mois
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Grille de commission</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Abonnement mensuel</h4>
                    <span className="text-2xl font-bold text-emerald-600">9.8€</span>
                  </div>
                  <p className="text-gray-600">
                    20% de 49€/mois pour chaque médecin actif
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Abonnement annuel</h4>
                    <span className="text-2xl font-bold text-emerald-600">99.8€</span>
                  </div>
                  <p className="text-gray-600">
                    20% de 499€/an pour chaque médecin actif
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}