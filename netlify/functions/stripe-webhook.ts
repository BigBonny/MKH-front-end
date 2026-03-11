import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const sig = event.headers['stripe-signature'] || '';
  const payload = event.body || '';

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ 
        error: err instanceof Error ? err.message : 'Invalid signature' 
      }),
    };
  }

  // Gestion des événements Stripe
  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        
        // Mettre à jour ou créer la commande dans Supabase
        const { error } = await supabase
          .from('orders')
          .upsert({
            stripe_payment_intent_id: session.payment_intent as string,
            status: 'processing',
            total_amount: (session.amount_total || 0) / 100, // Convertir centimes en euros
            shipping_address: session.shipping_details,
            metadata: session.metadata,
          }, {
            onConflict: 'stripe_payment_intent_id',
          });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        // Envoyer un email de confirmation (à implémenter)
        console.log('Payment succeeded for session:', session.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = stripeEvent.data.object as Stripe.Invoice;
        
        // Mettre à jour l'abonnement
        if (invoice.subscription) {
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: 'active',
              current_period_end: new Date(invoice.period_end * 1000).toISOString(),
            })
            .eq('stripe_subscription_id', invoice.subscription);

          if (error) {
            console.error('Supabase error:', error);
          }
        }
        break;
      }

      case 'customer.subscription.created': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        
        // Créer l'abonnement dans Supabase
        const { error } = await supabase
          .from('subscriptions')
          .insert({
            stripe_subscription_id: subscription.id,
            status: subscription.status as 'active' | 'cancelled' | 'expired',
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          });

        if (error) {
          console.error('Supabase error:', error);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        
        // Mettre à jour le statut de l'abonnement
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('Supabase error:', error);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal Server Error' 
      }),
    };
  }
};
