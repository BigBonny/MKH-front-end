import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
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

  try {
    const { items, customer_email, metadata, mode = 'payment' } = JSON.parse(event.body || '{}');

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Items are required' }),
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: unknown) => ({
        price_data: {
          currency: (item as { currency?: string }).currency || 'eur',
          product_data: {
            name: (item as { name: string }).name,
            description: (item as { description?: string }).description,
            images: (item as { images?: string[] }).images,
          },
          unit_amount: (item as { unit_amount: number }).unit_amount, // en centimes
        },
        quantity: (item as { quantity?: number }).quantity || 1,
      })),
      mode: mode as 'payment' | 'subscription',
      success_url: `${process.env.URL || process.env.DEPLOY_URL || 'http://localhost:8888'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || process.env.DEPLOY_URL || 'http://localhost:8888'}/payment/cancel`,
      customer_email,
      metadata: {
        ...metadata,
        source: 'mkh-website',
      },
      // Activer le remplissage automatique des adresses
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'CA', 'US', 'GB', 'DE', 'IT', 'ES', 'PT'],
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        sessionId: session.id, 
        url: session.url 
      }),
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal Server Error' 
      }),
    };
  }
};
