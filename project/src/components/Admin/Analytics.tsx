import React, { useState } from 'react';
import { Doctor } from '../../types';
import { BarChart3, Phone, Mail, Globe, Eye } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AnalyticsProps {
  doctors: Doctor[];
}

export default function Analytics({ doctors }: AnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const getTotalClicks = (type: keyof Doctor['clicks']) => {
    return doctors.reduce((sum, doctor) => sum + doctor.clicks[type], 0);
  };

  const getTopDoctors = () => {
    return [...doctors]
      .sort((a, b) => {
        const aTotal = Object.values(a.clicks).reduce((sum, val) => sum + val, 0);
        const bTotal = Object.values(b.clicks).reduce((sum, val) => sum + val, 0);
        return bTotal - aTotal;
      })
      .slice(0, 5);
  };

  const exportReport = () => {
    const doc = new jsPDF();
    
    const tableData = doctors.map(doctor => [
      doctor.name,
      doctor.specialty,
      doctor.clicks.profile,
      doctor.clicks.phone,
      doctor.clicks.email,
      doctor.clicks.website,
      Object.values(doctor.clicks).reduce((sum, val) => sum + val, 0)
    ]);

    autoTable(doc, {
      head: [['Name', 'Specialty', 'Profile Views', 'Phone Clicks', 'Email Clicks', 'Website Clicks', 'Total']],
      body: tableData,
    });

    doc.save('analytics-report.pdf');
  };

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-md ${
                selectedPeriod === period
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={exportReport}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          Export Report
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Profile Views</p>
              <p className="text-2xl font-semibold">{getTotalClicks('profile')}</p>
            </div>
            <Eye className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Phone Clicks</p>
              <p className="text-2xl font-semibold">{getTotalClicks('phone')}</p>
            </div>
            <Phone className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Email Clicks</p>
              <p className="text-2xl font-semibold">{getTotalClicks('email')}</p>
            </div>
            <Mail className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Website Clicks</p>
              <p className="text-2xl font-semibold">{getTotalClicks('website')}</p>
            </div>
            <Globe className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Top Performing Doctors */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Top Performing Doctors</h3>
        <div className="space-y-4">
          {getTopDoctors().map((doctor, index) => {
            const totalClicks = Object.values(doctor.clicks).reduce((sum, val) => sum + val, 0);
            const percentage = (totalClicks / doctors.reduce((sum, doc) => 
              sum + Object.values(doc.clicks).reduce((s, v) => s + v, 0), 0
            ) * 100).toFixed(1);

            return (
              <div key={doctor.id} className="flex items-center">
                <div className="w-8 text-sm text-gray-500">#{index + 1}</div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{doctor.name}</span>
                    <span className="text-sm text-gray-500">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}