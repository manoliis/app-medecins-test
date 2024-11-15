import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { read, utils } from 'xlsx';
import { FileSpreadsheet, Upload } from 'lucide-react';

interface BulkImportProps {
  onImport: (data: any[]) => void;
}

export default function BulkImport({ onImport }: BulkImportProps) {
  const { t } = useTranslation();

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = utils.sheet_to_json(worksheet);
        onImport(json);
      };
      reader.readAsArrayBuffer(file);
    }
  }, [onImport]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">{t('admin.bulkImport.title')}</h3>
      
      <div className="space-y-4">
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
          <h4 className="font-medium mb-2">{t('admin.bulkImport.template')}</h4>
          <p className="text-sm text-gray-600">
            {t('admin.bulkImport.templateDescription')}
          </p>
          <div className="mt-2">
            <a
              href="/template.xlsx"
              download
              className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700"
            >
              <Upload className="w-4 h-4 mr-1" />
              {t('admin.bulkImport.downloadTemplate')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}