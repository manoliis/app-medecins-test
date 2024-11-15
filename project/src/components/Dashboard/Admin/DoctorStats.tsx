import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Doctor } from '../../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, Calendar } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DoctorStatsProps {
  doctor: Doctor;
}

export default function DoctorStats({ doctor }: DoctorStatsProps) {
  const [period, setPeriod] = useState<'30d' | '6m' | '1y' | 'custom'>('30d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Données simulées pour les graphiques
  const generateMockData = (days: number) => {
    const data = [];
    const date = new Date();
    for (let i = 0; i < days; i++) {
      data.unshift({
        date: new Date(date.setDate(date.getDate() - 1)).toLocaleDateString(),
        visites: Math.floor(Math.random() * 20),
        appels: Math.floor(Math.random() * 10),
        emails: Math.floor(Math.random() * 8),
        rdv: Math.floor(Math.random() * 5),
        profil: Math.floor(Math.random() * 15)
      });
    }
    return data;
  };

  const data = generateMockData(period === '30d' ? 30 : period === '6m' ? 180 : 365);

  const handleExport = () => {
    const doc = new jsPDF();
    
    doc.text(`Rapport d'activité - ${doctor.name}`, 14, 15);
    doc.text(`Spécialité : ${doctor.specialty}`, 14, 25);
    doc.text(`Localisation : ${doctor.location}`, 14, 35);
    
    autoTable(doc, {
      startY: 45,
      head: [['Date', 'Visites', 'Appels', 'Emails', 'Rendez-vous']],
      body: data.map(d => [
        d.date,
        d.visites,
        d.appels,
        d.emails,
        d.rdv
      ]),
    });

    doc.save(`rapport-${doctor.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('30d')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              period === '30d'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            30 derniers jours
          </button>
          <button
            onClick={() => setPeriod('6m')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              period === '6m'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            6 mois
          </button>
          <button
            onClick={() => setPeriod('1y')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              period === '1y'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            1 an
          </button>
          <button
            onClick={() => setPeriod('custom')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              period === 'custom'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Personnalisé
          </button>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Exporter le rapport
        </button>
      </div>

      {period === 'custom' && (
        <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de début</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Visites totales</div>
          <div className="mt-2 text-3xl font-bold">{doctor.clicks.profile}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Appels reçus</div>
          <div className="mt-2 text-3xl font-bold">{doctor.clicks.phone}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Emails reçus</div>
          <div className="mt-2 text-3xl font-bold">{doctor.clicks.email}</div>
        </div>
      </div>

      {/* Graphique des visites */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-lg font-medium mb-4">Évolution des visites</h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="visites" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphique des interactions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-lg font-medium mb-4">Évolution des interactions</h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="appels" 
                stroke="#6366F1" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="emails" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="rdv" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphique des vues du profil */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-lg font-medium mb-4">Évolution des vues du profil</h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="profil" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}