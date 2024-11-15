import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { read, utils } from 'xlsx';
import { FileSpreadsheet, Upload } from 'lucide-react';
import { Doctor } from '../../../types';

interface BulkImportProps {
  onImport?: (doctors: Partial<Doctor>[]) => void;
}

export default function BulkImport({ onImport }: BulkImportProps) {
  const { t } = useTranslation();

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = utils.sheet_to_json(worksheet);
        
        // Process and validate the data
        const doctors = json.map((row: any) => ({
          name: row.Name,
          specialty: row.Specialty,
          location: row.Location,
          languages: (row.Languages || '').split(',').map((lang: string) => lang.trim()),
          phone: row.Phone,
          email: row.Email,
          website: row.Website,
          image: row.Image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80",
          approved: false,
          clicks: { phone: 0, email: 0, website: 0, profile: 0 },
          submittedBy: 'admin',
          submittedAt: new Date().toISOString(),
        }));

        onImport?.(doctors);
      } catch (error) {
        console.error('Error processing file:', error);
        alert(t('admin.bulkImport.error'));
      }
    };
    reader.readAsArrayBuffer(file);
  }, [onImport, t]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t('admin.bulkImport.title')}</h2>
        <a
          href="/template.xlsx"
          download
          className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:text-emerald-700"
        >
          <Upload className="w-4 h-4" />
          {t('admin.bulkImport.downloadTemplate')}
        </a>
      </div>

      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FileSpreadsheet className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">{t('admin.bulkImport.clickToUpload')}</span>
            </p>
            <p className="text-xs text-gray-500">{t('admin.bulkImport.excelFormat')}</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">{t('admin.bulkImport.instructions')}</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
          <li>{t('admin.bulkImport.instructionFormat')}</li>
          <li>{t('admin.bulkImport.instructionRequired')}</li>
          <li>{t('admin.bulkImport.instructionLanguages')}</li>
          <li>{t('admin.bulkImport.instructionImage')}</li>
        </ul>
      </div>
    </div>
  );
}