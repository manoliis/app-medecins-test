import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('privacy.title')}</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">{t('privacy.dataCollection.title')}</h2>
          <p className="text-gray-600">{t('privacy.dataCollection.description')}</p>
          <ul className="list-disc ml-6 mt-2">
            <li>{t('privacy.dataCollection.items.personal')}</li>
            <li>{t('privacy.dataCollection.items.usage')}</li>
            <li>{t('privacy.dataCollection.items.technical')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('privacy.dataUse.title')}</h2>
          <p className="text-gray-600">{t('privacy.dataUse.description')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('privacy.dataSecurity.title')}</h2>
          <p className="text-gray-600">{t('privacy.dataSecurity.description')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('privacy.userRights.title')}</h2>
          <ul className="list-disc ml-6">
            <li>{t('privacy.userRights.items.access')}</li>
            <li>{t('privacy.userRights.items.rectification')}</li>
            <li>{t('privacy.userRights.items.deletion')}</li>
            <li>{t('privacy.userRights.items.portability')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('privacy.contact.title')}</h2>
          <p className="text-gray-600">{t('privacy.contact.description')}</p>
        </section>
      </div>
    </div>
  );
}