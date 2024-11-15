import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, Printer, FileText } from 'lucide-react';
import { Doctor } from '../../types';

interface DoctorReportProps {
  doctors: Doctor[];
}

export default function DoctorReport({ doctors }: DoctorReportProps) {
  const { t } = useTranslation();
  const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);

  const handleSelectDoctor = (id: number) => {
    setSelectedDoctors(prev => 
      prev.includes(id) 
        ? prev.filter(docId => docId !== id)
        : [...prev, id]
    );
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableData = doctors
      .filter(doc => selectedDoctors.includes(doc.id))
      .map(doc => [
        doc.name,
        doc.specialty,
        doc.location,
        doc.languages.join(', '),
        doc.clicks.profile.toString(),
        doc.clicks.phone.toString(),
        doc.clicks.email.toString(),
      ]);

    autoTable(doc, {
      head: [[
        t('report.name'),
        t('report.specialty'),
        t('report.location'),
        t('report.languages'),
        t('report.profileViews'),
        t('report.phoneClicks'),
        t('report.emailClicks'),
      ]],
      body: tableData,
    });

    doc.save('doctor-report.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t('admin.report.title')}</h3>
        <div className="flex gap-2">
          <button
            onClick={generatePDF}
            disabled={selectedDoctors.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            {t('admin.report.export')}
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {doctors.map((doctor) => (
            <li key={doctor.id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDoctors.includes(doctor.id)}
                      onChange={() => handleSelectDoctor(doctor.id)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <div className="ml-4">
                      <p className="font-medium text-emerald-600 truncate">{doctor.name}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {doctor.specialty} • {doctor.location}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {doctor.clicks.profile}
                      </div>
                      <div className="flex items-center">
                        <Printer className="w-4 h-4 mr-1" />
                        {doctor.clicks.phone + doctor.clicks.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}