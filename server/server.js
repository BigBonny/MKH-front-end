const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors({
  origin: process.env.VITE_APP_URL || 'http://localhost:5173',
  credentials: true
}));

// Webhook middleware (must be before express.json())
app.use('/webhook/stripe', express.raw({ type: 'application/json' }));
app.use('/api/stripe-webhook', express.raw({ type: 'application/json' }));

// JSON parser for other routes
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    // Test purchased_items table
    const { data: testData, error: testError } = await supabase
      .from('purchased_items')
      .select('count(*)')
      .limit(1);
    
    if (testError) {
      return res.status(500).json({ 
        error: 'Database connection failed', 
        details: testError 
      });
    }
    
    res.json({ 
      status: 'Database connected', 
      message: 'purchased_items table is accessible',
      data: testData 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Database test failed', 
      details: error.message 
    });
  }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save contact message to database
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name,
          email,
          subject,
          message,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Contact DB error:', error);
      }
    } catch (dbError) {
      console.error('Contact DB save error:', dbError);
    }

    res.json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// Test endpoint for cart items
app.post('/api/test-cart', (req, res) => {
  console.log('🧪 Test - Full request body:', JSON.stringify(req.body, null, 2));
  console.log('🧪 Test - Cart items:', req.body.cartItems);
  res.json({ 
    received: true, 
    cartItems: req.body.cartItems,
    cartItemsType: typeof req.body.cartItems,
    bodyKeys: Object.keys(req.body)
  });
});

// Create checkout session
app.post('/api/create-checkout-session', async (req, res) => {
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
      } catch (parseError) {
        console.error('Error parsing cart items:', parseError);
        parsedCartItems = cartItems;
      }
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: plan,
              description: `Subscription to ${plan} plan`,
              images: [],
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/payment/cancel`,
      metadata: {
        plan: plan,
        price: price,
        userId: userId, // Store Clerk user ID
        userEmail: userEmail, // Store user email
        cartItems: JSON.stringify(parsedCartItems), // Store cart items as JSON string
      },
      customer_email: userEmail, // Pre-fill customer email
    });

    console.log('Session created:', session.id);
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Webhook handler for Stripe events (old endpoint)
app.post('/webhook/stripe', async (req, res) => {
  console.log('🎣 Webhook received (old endpoint)!');
  await handleStripeWebhook(req, res);
});

// Webhook handler for Stripe events (new endpoint - what Stripe CLI uses)
app.post('/api/stripe-webhook', async (req, res) => {
  console.log('🎣 Webhook received (new endpoint)!');
  await handleStripeWebhook(req, res);
});

// Shared webhook handler function
async function handleStripeWebhook(req, res) {
  console.log('🎣 Webhook received!');
  console.log('📋 Headers:', Object.keys(req.headers));
  
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.log('❌ Webhook signature missing');
    return res.status(400).json({ error: 'Webhook signature missing' });
  }

  try {
    console.log('🔍 Verifying webhook signature...');
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    console.log('📨 Event type:', event.type);
    console.log('📨 Event data:', JSON.stringify(event.data.object, null, 2));

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('💰 Payment successful:', session.id);
        console.log('📧 Plan:', session.metadata.plan);
        console.log('💵 Amount:', session.amount_total / 100);
        console.log('📧 Customer email:', session.customer_details?.email);
        
        // Check if this is a subscription or store purchase
        if (session.metadata.plan === 'Store Purchase') {
          // Store purchase - save to purchased_items table
          try {
            console.log('🛍️ Processing store purchase...');
            console.log('📦 Full session metadata:', JSON.stringify(session.metadata, null, 2));
            console.log('💰 Session amount_total:', session.amount_total);
            console.log('👤 Session user ID:', session.metadata.userId);
            
            let cartItems = [];
            try {
              // Try to parse cart items from metadata
              if (session.metadata.cartItems) {
                console.log('📦 Found cartItems in session.metadata.cartItems');
                cartItems = JSON.parse(session.metadata.cartItems);
                console.log('🛒 Parsed cart items:', cartItems);
              } else if (req.body.metadata && req.body.metadata.cartItems) {
                console.log('📦 Found cartItems in req.body.metadata.cartItems');
                cartItems = JSON.parse(req.body.metadata.cartItems);
                console.log('🛒 Parsed cart items:', cartItems);
              } else {
                console.log('⚠️ No cart items found in metadata');
                console.log('📦 Available metadata keys:', Object.keys(session.metadata));
              }
            } catch (parseError) {
              console.error('❌ Error parsing cart items:', parseError);
            }
            
            const { data, error } = await supabase
              .from('purchased_items')
              .insert({
                user_id: session.metadata.userId,
                stripe_payment_id: session.id,
                items: cartItems,
                total_amount: session.amount_total / 100, // Stripe amount is in cents, convert to euros
                currency: session.currency,
                status: 'completed',
                customer_email: session.customer_details?.email,
                created_at: new Date().toISOString(),
              })
              .select();

            if (error) {
              console.error('❌ Purchased items DB error:', error);
              console.error('❌ Full DB error:', JSON.stringify(error, null, 2));
            } else {
              console.log('✅ Purchased items saved:', data);
              console.log('🛍️ Items purchased:', cartItems);
              console.log('👤 User ID:', session.metadata.userId);
            }
          } catch (dbError) {
            console.error('❌ Purchased items save error:', dbError);
            console.error('❌ Full DB error:', JSON.stringify(dbError, null, 2));
          }
        } else {
          // Subscription purchase - save to subscriptions table
          try {
            console.log('💾 Attempting to save subscription to database...');
            const { data, error } = await supabase
              .from('subscriptions')
              .insert({
                user_id: session.metadata.userId, // Use Clerk user ID from metadata
                plan_type: session.metadata.plan.toLowerCase() === 'essentiel' ? 'basic' : 
                          session.metadata.plan.toLowerCase() === 'premium' ? 'premium' : 'vip',
                status: 'active',
                stripe_subscription_id: session.id,
                current_period_start: new Date().toISOString(),
                current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                created_at: new Date().toISOString(),
              })
              .select();

            if (error) {
              console.error('❌ Database error:', error);
              console.error('❌ Full error details:', JSON.stringify(error, null, 2));
            } else {
              console.log('✅ Subscription saved to database:', data);
              console.log('✅ User ID:', session.metadata.userId);
              console.log('✅ Plan:', session.metadata.plan);
            }
          } catch (dbError) {
            console.error('❌ Database save error:', dbError);
            console.error('❌ Full DB error:', JSON.stringify(dbError, null, 2));
          }
        }
        
        // Send email notification (TODO)
        console.log('📧 Email notification sent to bigbonny481@gmail.com');
        break;
        
      case 'checkout.session.expired':
        console.log('❌ Payment expired:', event.data.object);
        break;
        
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('🔴 Webhook error:', error);
    console.error('🔴 Full error details:', JSON.stringify(error, null, 2));
    res.status(400).json({ error: 'Webhook signature verification failed' });
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💳 Stripe endpoint: http://localhost:${PORT}/api/create-checkout-session`);
  console.log(`🎣 Webhook endpoint: http://localhost:${PORT}/webhook/stripe`);
  console.log(`🎣 Webhook endpoint (Stripe CLI): http://localhost:${PORT}/api/stripe-webhook`);
});
