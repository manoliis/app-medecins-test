import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Check } from 'lucide-react';
import { Doctor } from '../../types';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface SubscriptionProps {
  doctor: Doctor;
  onSubscriptionUpdate: (doctorId: number, isActive: boolean) => void;
}

export default function Subscription({ doctor, onSubscriptionUpdate }: SubscriptionProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          priceId: import.meta.env.VITE_STRIPE_PRICE_ID,
        }),
      });

      const session = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{t('subscription.title')}</h3>
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-600" />
          <span className="font-medium text-emerald-600">
            {t('subscription.price')}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{t('subscription.features.visibility')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{t('subscription.features.analytics')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{t('subscription.features.priority')}</span>
        </div>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="mt-4 w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? t('subscription.processing') : t('subscription.subscribe')}
      </button>
    </div>
  );
}