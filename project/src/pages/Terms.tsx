import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Terms() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('terms.title')}</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">{t('terms.acceptance.title')}</h2>
          <p className="text-gray-600">{t('terms.acceptance.description')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('terms.services.title')}</h2>
          <p className="text-gray-600">{t('terms.services.description')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('terms.userContent.title')}</h2>
          <p className="text-gray-600">{t('terms.userContent.description')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('terms.liability.title')}</h2>
          <p className="text-gray-600">{t('terms.liability.description')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('terms.modifications.title')}</h2>
          <p className="text-gray-600">{t('terms.modifications.description')}</p>
        </section>
      </div>
    </div>
  );
}