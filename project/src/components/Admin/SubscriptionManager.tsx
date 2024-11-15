import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Doctor } from '../../types';

interface SubscriptionManagerProps {
  doctor: Doctor;
  onUpdateSubscription: (doctorId: number, isActive: boolean) => void;
}

export default function SubscriptionManager({ doctor, onUpdateSubscription }: SubscriptionManagerProps) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe not initialized');
      return;
    }

    try {
      // In a real app, this would create a subscription through your backend
      // For demo purposes, we'll just toggle the subscription status
      onUpdateSubscription(doctor.id, true);
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-4">Subscription Status</h3>
      {doctor.subscription?.active ? (
        <div className="space-y-2">
          <p className="text-green-600">Active Subscription</p>
          <p>Plan: {doctor.subscription.plan}</p>
          <p>Expires: {new Date(doctor.subscription.endDate).toLocaleDateString()}</p>
          <button
            onClick={() => onUpdateSubscription(doctor.id, false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Cancel Subscription
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="space-y-4">
          <div className="p-4 border rounded">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }} />
          </div>
          <button
            type="submit"
            disabled={!stripe}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}