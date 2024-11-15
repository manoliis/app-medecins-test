import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, Calendar, Activity, Users, PhoneCall, Mail, Search } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Doctor } from '../../../types';

interface AnalyticsProps {
  doctors: Doctor[];
}

export default function Analytics({ doctors }: AnalyticsProps) {
  const { t } = useTranslation();
  const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);
  const [period, setPeriod] = useState<'7d' | 'current' | 'lastMonth' | 'lastYear' | 'thisYear' | 'custom'>('current');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrer les médecins par recherche
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer les totaux pour les médecins sélectionnés
  const selectedStats = {
    profile: selectedDoctors.reduce((acc, id) => {
      const doctor = doctors.find(d => d.id === id);
      return acc + (doctor?.clicks.profile || 0);
    }, 0),
    phone: selectedDoctors.reduce((acc, id) => {
      const doctor = doctors.find(d => d.id === id);
      return acc + (doctor?.clicks.phone || 0);
    }, 0),
    email: selectedDoctors.reduce((acc, id) => {
      const doctor = doctors.find(d => d.id === id);
      return acc + (doctor?.clicks.email || 0);
    }, 0),
    website: selectedDoctors.reduce((acc, id) => {
      const doctor = doctors.find(d => d.id === id);
      return acc + (doctor?.clicks.website || 0);
    }, 0)
  };

  // Top 3 des médecins les plus actifs
  const topDoctors = [...doctors]
    .sort((a, b) => {
      const aTotal = Object.values(a.clicks).reduce((sum, val) => sum + val, 0);
      const bTotal = Object.values(b.clicks).reduce((sum, val) => sum + val, 0);
      return bTotal - aTotal;
    })
    .slice(0, 3);

  // Générer des données pour le graphique
  const generateAnalyticsData = (days: number) => {
    const data = [];
    const date = new Date();
    
    for (let i = 0; i < days; i++) {
      const dayData = {
        date: new Date(date.setDate(date.getDate() - 1)).toLocaleDateString(),
        views: 0,
        calls: 0,
        emails: 0,
        website: 0
      };

      // Agréger les données des médecins sélectionnés
      selectedDoctors.forEach(id => {
        const doctor = doctors.find(d => d.id === id);
        if (doctor) {
          const baseViews = doctor.clicks.profile / days;
          const baseCalls = doctor.clicks.phone / days;
          const baseEmails = doctor.clicks.email / days;
          const baseWebsite = (doctor.clicks.website || 0) / days;

          dayData.views += Math.max(0, Math.round(baseViews + (Math.random() * baseViews * 0.5)));
          dayData.calls += Math.max(0, Math.round(baseCalls + (Math.random() * baseCalls * 0.5)));
          dayData.emails += Math.max(0, Math.round(baseEmails + (Math.random() * baseEmails * 0.5)));
          dayData.website += Math.max(0, Math.round(baseWebsite + (Math.random() * baseWebsite * 0.5)));
        }
      });

      data.unshift(dayData);
    }
    return data;
  };

  const getPeriodDays = () => {
    const now = new Date();
    switch (period) {
      case '7d': return 7;
      case 'current': return now.getDate();
      case 'lastMonth': return new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      case 'lastYear': return 365;
      case 'thisYear': return Math.floor((now - new Date(now.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24));
      case 'custom':
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        }
        return 30;
      default: return 30;
    }
  };

  const data = generateAnalyticsData(getPeriodDays());

  const handleExport = () => {
    if (selectedDoctors.length === 0) {
      alert('Veuillez sélectionner au moins un médecin');
      return;
    }

    const doc = new jsPDF();
    
    // Titre
    doc.setFontSize(20);
    doc.text('Rapport d\'activité des médecins', 20, 20);
    
    // Période
    doc.setFontSize(12);
    doc.text(`Période: ${period}`, 20, 30);
    
    // Statistiques globales
    doc.text('Statistiques globales', 20, 45);
    const globalStats = [
      ['Vues totales', selectedStats.profile.toString()],
      ['Appels', selectedStats.phone.toString()],
      ['Emails', selectedStats.email.toString()],
      ['Visites site web', selectedStats.website.toString()]
    ];
    
    autoTable(doc, {
      startY: 50,
      head: [['Métrique', 'Total']],
      body: globalStats,
    });

    // Détails par médecin
    doc.text('Détails par médecin', 20, doc.lastAutoTable.finalY + 20);
    
    const doctorDetails = selectedDoctors.map(id => {
      const doctor = doctors.find(d => d.id === id);
      return [
        doctor?.name,
        doctor?.specialty,
        doctor?.clicks.profile.toString(),
        doctor?.clicks.phone.toString(),
        doctor?.clicks.email.toString(),
        doctor?.clicks.website?.toString() || '0'
      ];
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      head: [['Nom', 'Spécialité', 'Vues', 'Appels', 'Emails', 'Site web']],
      body: doctorDetails,
    });

    doc.save('rapport-statistiques.pdf');
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de période */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {[
            { value: '7d', label: '7 derniers jours' },
            { value: 'current', label: 'Ce mois-ci' },
            { value: 'lastMonth', label: 'Le mois dernier' },
            { value: 'thisYear', label: 'Cette année' },
            { value: 'lastYear', label: 'L\'année dernière' },
            { value: 'custom', label: 'Personnalisé' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriod(value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                period === value
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={handleExport}
          disabled={selectedDoctors.length === 0}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Exporter le rapport
        </button>
      </div>

      {/* Sélecteur de dates personnalisées */}
      {period === 'custom' && (
        <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
          <div>
            <label className="block text-sm text-gray-700">Date de début</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Date de fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Recherche et sélection des médecins */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un médecin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={() => setSelectedDoctors([])}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Désélectionner tout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map(doctor => (
            <label key={doctor.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selectedDoctors.includes(doctor.id)}
                onChange={() => {
                  setSelectedDoctors(prev =>
                    prev.includes(doctor.id)
                      ? prev.filter(id => id !== doctor.id)
                      : [...prev, doctor.id]
                  );
                }}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <p className="font-medium">{doctor.name}</p>
                <p className="text-sm text-gray-500">{doctor.specialty}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {selectedDoctors.length > 0 && (
        <>
          {/* Statistiques globales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Vues totales</p>
                  <p className="text-2xl font-semibold">{selectedStats.profile}</p>
                </div>
                <Activity className="w-8 h-8 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Appels</p>
                  <p className="text-2xl font-semibold">{selectedStats.phone}</p>
                </div>
                <PhoneCall className="w-8 h-8 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Emails</p>
                  <p className="text-2xl font-semibold">{selectedStats.email}</p>
                </div>
                <Mail className="w-8 h-8 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Visites site web</p>
                  <p className="text-2xl font-semibold">{selectedStats.website}</p>
                </div>
                <Activity className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Graphique d'évolution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-6">Évolution des interactions</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval={Math.floor(data.length / 6)}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    name="Vues"
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="calls" 
                    name="Appels"
                    stroke="#6366F1" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="emails" 
                    name="Emails"
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="website" 
                    name="Site web"
                    stroke="#EF4444" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Top 3 des médecins */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Top 3 des médecins les plus actifs</h3>
        <div className="space-y-4">
          {topDoctors.map((doctor, index) => {
            const totalInteractions = Object.values(doctor.clicks).reduce((sum, val) => sum + val, 0);
            return (
              <div key={doctor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-sm text-gray-500">{doctor.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-emerald-600">
                    {totalInteractions} interactions
                  </p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}