// Vercel Serverless Function - Checkout API
// File: api/create-checkout-session.js

const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.VITE_APP_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan, price, currency = 'eur', userId, userEmail, cartItems } = req.body;

    if (!plan || !price) {
      return res.status(400).json({ error: 'Plan and price are required' });
    }

    if (!userId || !userEmail) {
      return res.status(400).json({ error: 'User authentication required' });
    }

    // Parse cart items if it's a string
    let parsedCartItems = [];
    if (cartItems) {
      try {
        parsedCartItems = JSON.parse(cartItems);
      } catch {
        parsedCartItems = cartItems;
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: plan,
              description: `Purchase by ${userEmail}`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.VITE_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}/inscription`,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        plan: plan,
        cartItems: JSON.stringify(parsedCartItems),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
