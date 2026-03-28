# Vercel Deployment Guide for MKH Website

## **Current Setup**
- ✅ Frontend: Vite + React
- ✅ Authentication: Clerk
- ✅ Payments: Stripe
- ✅ Database: Supabase
- 🔄 Target: Vercel Deployment

## **For Vercel Deployment**

### **Option 1: Use Vercel Functions (Recommended)**
Vercel supports serverless functions similar to Next.js API routes.

#### **1. Create Vercel Functions Structure**
Create `api/` folder at root level (same as `src/`):

```
app/
├── api/
│   ├── create-checkout-session.ts
│   └── stripe-webhook.ts
├── src/
└── ...
```

#### **2. Update Environment Variables for Vercel**
```env
# Frontend (VITE_ prefix)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=https://your-domain.vercel.app

# Backend (no prefix for Vercel Functions)
CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### **3. Vercel Function Files**
The API routes I created will work on Vercel, but they need to be in the correct format.

### **Option 2: Use Edge Functions (Alternative)**
Create `vercel.json` configuration:

```json
{
  "functions": {
    "api/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "STRIPE_SECRET_KEY": "@stripe-secret-key",
    "STRIPE_WEBHOOK_SECRET": "@stripe-webhook-secret"
  }
}
```

### **Option 3: Use Third-party Services**
If Vercel Functions are complex, use:
- **Stripe Checkout Links** (direct from Stripe Dashboard)
- **Zapier** or **Make.com** for webhooks
- **Supabase Edge Functions**

## **Current Status**
✅ Frontend ready for Vercel
✅ Local development works with direct Stripe
⚠️ Need to fix API routes for Vercel Functions

## **Next Steps**
1. Choose deployment option
2. Update API routes format
3. Configure environment variables in Vercel
4. Set up Stripe webhooks
5. Deploy and test

## **For Now**
The inscription section works locally with direct Stripe checkout. When you're ready for Vercel deployment, we'll finalize the backend setup.
