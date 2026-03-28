# Production-Ready Stripe Integration - SETUP GUIDE

## 🚀 Quick Start

### 1. Install Server Dependencies
```bash
cd server
npm install
```

### 2. Start Backend Server
```bash
npm run dev
```
Server runs on `http://localhost:3000`

### 3. Start Frontend (new terminal)
```bash
cd ..
npm run dev  
```
Frontend runs on `http://localhost:5173`

### 4. Test Real Payments
- Click subscription buttons
- Use test card: `4242 4242 4242 4242`
- Complete real Stripe checkout flow

## ✅ Production Features

**Real Stripe Integration:**
- ✅ Live checkout sessions
- ✅ Secure backend API  
- ✅ Webhook handling
- ✅ Error handling
- ✅ CORS protection

**Security:**
- ✅ Secret keys hidden
- ✅ Webhook verification
- ✅ Environment variables
- ✅ CORS protection

**User Experience:**
- ✅ Loading states
- ✅ Error messages  
- ✅ Success redirects
- ✅ Toast notifications

## 📋 Environment Setup

### Frontend (.env)
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51Sji3DBQV6gnUXAJ1gs7vcmk5QvRFBYYr4S93NRLvJFxGTGye09Ez870oKLArXWCq0p0AylzcyvcpqqwAm5UTlCi00kNlrfrQ4
VITE_APP_URL=http://localhost:5173
```

### Backend (server/.env) 
```
STRIPE_SECRET_KEY=sk_test_51Sji3DBQV6gnUXAJQDjB23wLTm2Eo7SdxT1XqO9Hnx9nqwOdabpTJfYVUoiri7oVsbFrxvXGlPPuv6JLjO5J36Vr00BD6lyK6d
STRIPE_WEBHOOK_SECRET=whsec_8e328583d2751b9cf6e596585330603966b64153147051e5a62da9ab90b1c7d6
VITE_APP_URL=http://localhost:5173
```

## 💳 Test Cards

- **Visa:** 4242 4242 4242 4242
- **Mastercard:** 5555 5555 5555 4444  
- **Declined:** 4000 0000 0000 0002

Use any future expiry date, any 3-digit CVC.

## 🌐 Deployment

### Vercel (Frontend)
1. Push to GitHub
2. Connect Vercel to repo
3. Set env vars in Vercel dashboard
4. Deploy

### Railway/Render (Backend)
1. Push to GitHub
2. Connect to repo  
3. Set env vars
4. Deploy
5. Update frontend API URL

## 📊 Monitoring

- Server logs for webhooks
- Stripe Dashboard for payments
- Stripe alerts for failures
