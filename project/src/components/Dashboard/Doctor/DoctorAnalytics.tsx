import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Eye, Phone, Mail, Globe, Calendar } from 'lucide-react';
import { Doctor } from '../../../types';

interface DoctorAnalyticsProps {
  doctor: Doctor;
}

export default function DoctorAnalytics({ doctor }: DoctorAnalyticsProps) {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'7d' | 'current' | 'lastMonth' | '30d' | '1y' | 'custom'>('current');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Ensure clicks object exists with default values
  const clicks = doctor?.clicks || { profile: 0, phone: 0, email: 0, website: 0 };

  // Filtrer les données en fonction de la période sélectionnée
  const filterDataByDate = (data: any[]) => {
    if (period === 'custom' && startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      return data.filter(item => {
        const itemDate = new Date(item.date).getTime();
        return itemDate >= start && itemDate <= end;
      });
    }

    const now = new Date();

    if (period === 'current') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      return data.filter(item => new Date(item.date) >= firstDay);
    }

    if (period === 'lastMonth') {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      return data.filter(item => {
        const date = new Date(item.date);
        return date >= firstDay && date <= lastDay;
      });
    }

    const periods = {
      '7d': 7,
      '30d': 30,
      '1y': 365
    };

    const days = periods[period] || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return data.filter(item => new Date(item.date) >= cutoffDate);
  };

  // Générer des données réalistes pour les graphiques
  const generateAnalyticsData = (days: number) => {
    const data = [];
    const date = new Date();
    const baseViews = clicks.profile / days;
    const baseCalls = clicks.phone / days;
    const baseEmails = clicks.email / days;
    const baseWebsite = (clicks.website || 0) / days;

    for (let i = 0; i < days; i++) {
      data.unshift({
        date: new Date(date.setDate(date.getDate() - 1)).toLocaleDateString(),
        views: Math.max(0, Math.round(baseViews + (Math.random() * baseViews * 0.5))),
        calls: Math.max(0, Math.round(baseCalls + (Math.random() * baseCalls * 0.5))),
        emails: Math.max(0, Math.round(baseEmails + (Math.random() * baseEmails * 0.5))),
        website: Math.max(0, Math.round(baseWebsite + (Math.random() * baseWebsite * 0.5)))
      });
    }
    return data;
  };

  const getPeriodDays = () => {
    const now = new Date();
    switch (period) {
      case '7d': return 7;
      case 'current': return now.getDate();
      case 'lastMonth': return new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      case '30d': return 30;
      case '1y': return 365;
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

  const data = filterDataByDate(generateAnalyticsData(getPeriodDays()));

  const calculateTotalInteractions = (data: any[]) => {
    return data.reduce((acc, curr) => acc + curr.views + curr.calls + curr.emails + curr.website, 0);
  };

  const findBestDay = (data: any[]) => {
    return data.reduce((best, curr) => {
      const currTotal = curr.views + curr.calls + curr.emails + curr.website;
      const bestTotal = best.views + best.calls + best.emails + best.website;
      return currTotal > bestTotal ? curr : best;
    });
  };

  const calculateDailyAverage = (data: any[]) => {
    const total = calculateTotalInteractions(data);
    return Math.round(total / data.length);
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
            { value: '30d', label: '30 derniers jours' },
            { value: '1y', label: 'Cette année' },
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

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Vues du profil</p>
              <p className="text-2xl font-semibold">{clicks.profile}</p>
            </div>
            <Eye className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Appels reçus</p>
              <p className="text-2xl font-semibold">{clicks.phone}</p>
            </div>
            <Phone className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Emails reçus</p>
              <p className="text-2xl font-semibold">{clicks.email}</p>
            </div>
            <Mail className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Visites site web</p>
              <p className="text-2xl font-semibold">{clicks.website || 0}</p>
            </div>
            <Globe className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Graphique d'évolution */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-6">Évolution de votre visibilité</h3>
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

      {/* Résumé des performances */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Résumé des performances</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-medium">Meilleur jour</p>
                <p className="text-sm text-gray-500">{findBestDay(data).date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-emerald-600">
                {Math.max(...data.map(d => d.views + d.calls + d.emails + d.website))} interactions
              </p>
              <p className="text-sm text-gray-500">Total des interactions</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-medium">Moyenne quotidienne</p>
                <p className="text-sm text-gray-500">Sur la période sélectionnée</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-emerald-600">
                {calculateDailyAverage(data)} interactions
              </p>
              <p className="text-sm text-gray-500">Par jour</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}