import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Doctor } from '../../types';
import { CreditCard, AlertCircle } from 'lucide-react';

interface DoctorSubscriptionsProps {
  doctors: Doctor[];
  onUpdateVisibility: (doctorId: number, isVisible: boolean) => void;
}

export default function DoctorSubscriptions({ doctors, onUpdateVisibility }: DoctorSubscriptionsProps) {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    monthly: {
      price: '49.99€',
      period: t('subscription.monthly'),
      priceId: 'price_monthly'
    },
    yearly: {
      price: '499.99€',
      period: t('subscription.yearly'),
      priceId: 'price_yearly'
    }
  };

  const handleSubscriptionChange = async (doctorId: number, subscribed: boolean) => {
    try {
      const response = await fetch('/api/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId,
          subscribed,
          planType: selectedPlan
        }),
      });

      if (!response.ok) throw new Error('Failed to update subscription');
      
      onUpdateVisibility(doctorId, subscribed);
    } catch (error) {
      console.error('Subscription update error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{t('subscription.management')}</h2>
        
        {/* Plan Selection */}
        <div className="flex gap-4 mb-6">
          {Object.entries(plans).map(([key, plan]) => (
            <button
              key={key}
              onClick={() => setSelectedPlan(key as 'monthly' | 'yearly')}
              className={`flex-1 p-4 rounded-lg border-2 ${
                selectedPlan === key 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{plan.period}</span>
                <CreditCard className={`w-5 h-5 ${
                  selectedPlan === key ? 'text-emerald-500' : 'text-gray-400'
                }`} />
              </div>
              <div className="text-2xl font-bold">{plan.price}</div>
            </button>
          ))}
        </div>

        {/* Doctor List */}
        <div className="space-y-4">
          {doctors.map(doctor => (
            <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{doctor.name}</h3>
                <p className="text-sm text-gray-500">{doctor.specialty}</p>
              </div>

              <div className="flex items-center gap-4">
                {!doctor.subscription?.active && (
                  <div className="flex items-center text-amber-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{t('subscription.inactive')}</span>
                  </div>
                )}
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={doctor.subscription?.active || false}
                    onChange={(e) => handleSubscriptionChange(doctor.id, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Info */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-medium mb-4">{t('subscription.info.title')}</h3>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>{t('subscription.info.visibility')}</li>
          <li>{t('subscription.info.payment')}</li>
          <li>{t('subscription.info.cancellation')}</li>
        </ul>
      </div>
    </div>
  );
}