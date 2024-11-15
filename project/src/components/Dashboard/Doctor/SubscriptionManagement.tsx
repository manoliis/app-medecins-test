import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Check, Calendar, Clock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface SubscriptionManagementProps {
  doctor: Doctor;
}

export default function SubscriptionManagement({ doctor }: SubscriptionManagementProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);

  const plans = {
    monthly: {
      price: '49€',
      period: 'Mensuel',
      priceId: import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID
    },
    yearly: {
      price: '499€',
      period: 'Annuel',
      priceId: import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          priceId: plans[selectedPlan].priceId,
          plan: selectedPlan
        }),
      });

      const session = await response.json();
      await stripe.redirectToCheckout({
        sessionId: session.id
      });
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (doctor.subscription?.active) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Votre abonnement</h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Actif
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-emerald-600 mr-2" />
              <span className="font-medium">Formule actuelle</span>
            </div>
            <span>{doctor.subscription.plan === 'monthly' ? '49€/mois' : '499€/an'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Clock className="w-4 h-4 mr-1" />
                Membre depuis
              </div>
              <div className="font-medium">
                {new Date(doctor.subscription.memberSince).toLocaleDateString()}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4 mr-1" />
                Début de l'abonnement
              </div>
              <div className="font-medium">
                {new Date(doctor.subscription.startDate).toLocaleDateString()}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4 mr-1" />
                Renouvellement prévu le
              </div>
              <div className="font-medium">
                {new Date(doctor.subscription.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-medium mb-6">Choisissez votre formule</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.entries(plans).map(([key, plan]) => (
          <button
            key={key}
            onClick={() => setSelectedPlan(key as 'monthly' | 'yearly')}
            className={`p-4 rounded-lg border-2 text-left ${
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
            <div className="text-2xl font-bold mb-2">{plan.price}</div>
            {key === 'yearly' && (
              <div className="text-sm text-emerald-600">
                Économisez 89€ avec l'abonnement annuel
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center">
          <Check className="w-5 h-5 text-emerald-600 mr-2" />
          <span>Profil visible sur notre plateforme</span>
        </div>
        <div className="flex items-center">
          <Check className="w-5 h-5 text-emerald-600 mr-2" />
          <span>Statistiques détaillées de votre profil</span>
        </div>
        <div className="flex items-center">
          <Check className="w-5 h-5 text-emerald-600 mr-2" />
          <span>Support prioritaire 7j/7</span>
        </div>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading 
          ? "Traitement en cours..."
          : `S'abonner pour ${plans[selectedPlan].price}${selectedPlan === 'monthly' ? '/mois' : '/an'}`}
      </button>

      <p className="mt-4 text-sm text-gray-500 text-center">
        Paiement sécurisé par Stripe. Annulation possible à tout moment.
      </p>
    </div>
  );
}