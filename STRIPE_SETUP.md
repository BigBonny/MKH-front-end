# Stripe Webhook Configuration Guide

## **Current Issue**
The inscription section isn't working because:
1. You're using Vite + React (not Next.js)
2. Netlify Functions need to be deployed or run with Netlify CLI locally
3. API calls were using Next.js format instead of Netlify Functions format

## **Fixed Issues**
✅ Updated frontend to use `/.netlify/functions/create-checkout-session`
✅ Fixed API call structure to match Netlify Functions
✅ Removed non-existent `/api/register-user` call

## **To Make It Work Locally**

### Option 1: Use Netlify CLI (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run locally
netlify dev
```

### Option 2: Test with Stripe Checkout Directly
For testing, you can temporarily modify the handleSubscription function to use Stripe's direct checkout:

```typescript
const handleSubscription = async (plan: { name: string; price: string; period: string; features: string[]; popular?: boolean }) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      toast.error(t('inscription.form.error'));
      return;
    }
    
    // Direct Stripe checkout for testing
    const { error } = await stripe.redirectToCheckout({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: plan.name,
            description: `Subscription to ${plan.name} plan`,
          },
          unit_amount: parseInt(plan.price.replace('€', '')) * 100,
        },
        quantity: 1,
      }],
      success_url: `${window.location.origin}/payment/success`,
      cancel_url: `${window.location.origin}/payment/cancel`,
    });
    
    if (error) {
      toast.error(t('inscription.form.error'));
    } else {
      toast.success(t('inscription.form.success'));
      setShowForm(false);
    }
  } catch (error) {
    toast.error(t('inscription.form.error'));
  }
};
```

## **Environment Variables Required**
Make sure your `.env` file has:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## **Stripe Webhook Setup**
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy webhook secret to your environment variables

## **Deployment**
Once deployed to Netlify, the functions will work automatically with the current code.

## **Testing**
1. Run `netlify dev` for local testing
2. Or deploy to Netlify for full functionality
3. Test with Stripe test cards: 4242 4242 4242 4242
