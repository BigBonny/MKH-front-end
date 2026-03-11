import { loadStripe, type Stripe } from '@stripe/stripe-js';

// Stripe client-side configuration
// Documentation: https://stripe.com/docs/js

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

let stripePromise: Promise<Stripe | null>;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey || '');
  }
  return stripePromise;
}

// Prix des produits Stripe (à configurer dans le dashboard Stripe)
export const STRIPE_PRICE_IDS = {
  // Abonnements
  subscriptions: {
    basic: 'price_basic_monthly',    // Remplacer par vos vrais price IDs
    premium: 'price_premium_monthly',
    vip: 'price_vip_monthly',
  },
  // Produits du store (si vous utilisez Stripe pour les produits physiques)
  products: {
    // Vous pouvez aussi créer des produits dynamiquement via l'API
  },
};

// Configuration des paiements
export const PAYMENT_CONFIG = {
  currency: 'eur',
  successUrl: `${import.meta.env.VITE_APP_URL}/payment/success`,
  cancelUrl: `${import.meta.env.VITE_APP_URL}/payment/cancel`,
};

// Types pour les paiements
export interface CheckoutSessionData {
  items: {
    price_data: {
      currency: string;
      product_data: {
        name: string;
        description?: string;
        images?: string[];
      };
      unit_amount: number; // en centimes
    };
    quantity: number;
  }[];
  customer_email?: string;
  metadata?: Record<string, string>;
}

export interface SubscriptionData {
  priceId: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}
