import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe('YOUR_PUBLISHABLE_KEY');