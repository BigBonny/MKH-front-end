# MKH Website - Vercel Deployment Guide

## Prerequisites
- Vercel account (free at vercel.com)
- GitHub/GitLab/Bitbucket account
- Your code pushed to a git repository

## Step-by-Step Deployment

### 1. Push Code to GitHub
```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit for Vercel deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/mkh-website.git

# Push
git push -u origin main
```

### 2. Connect to Vercel
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the repository: `mkh-website`

### 3. Configure Build Settings
**Framework Preset:** Vite
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### 4. Environment Variables
Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 5. Deploy
Click "Deploy" and wait for the build to complete!

## Backend Server Deployment (Separate)

Your Express server needs separate deployment:

### Option A: Vercel Serverless Functions
Convert server.js to Vercel API routes in `/api` folder

### Option B: Railway/Render (Recommended)
1. Go to https://railway.app or https://render.com
2. Create new project
3. Connect your repo
4. Set start command: `node server/server.js`
5. Add environment variables:
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET
   - SUPABASE_SERVICE_ROLE_KEY
   - VITE_SUPABASE_URL

### Option C: Keep Local (Development Only)
For production, you MUST deploy the backend somewhere.

## Post-Deployment Checklist

### Immediate Checks:
- [ ] Homepage loads correctly
- [ ] All images display properly
- [ ] Navigation works
- [ ] Cart functionality works
- [ ] Sign in/up works (Clerk)
- [ ] Database connections work

### Stripe Configuration:
- [ ] Update Stripe webhook URL to production domain
- [ ] Add production domain to Stripe allowed domains
- [ ] Test payment flow with test card: 4242 4242 4242 4242

### Clerk Configuration:
- [ ] Add production domain to Clerk allowed origins
- [ ] Update Clerk publishable key if using production instance

### Supabase:
- [ ] Run all SQL scripts in production database
- [ ] Verify RLS policies are configured
- [ ] Check that cart_items table exists

### DNS (Custom Domain):
1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Vercel: Project → Domains → Add Domain
3. Update DNS records as instructed by Vercel
4. Wait for SSL certificate provisioning

## Troubleshooting

### Build Fails:
- Check that all dependencies are in package.json
- Ensure no syntax errors
- Verify environment variables are set

### API Calls Fail:
- Backend server must be deployed separately
- Check CORS settings in server.js
- Verify API URLs in frontend code

### Stripe Webhooks Fail:
- Update webhook endpoint URL in Stripe Dashboard
- Ensure server is publicly accessible
- Check webhook secret is correct

### Database Connection Fails:
- Verify Supabase URL and key
- Check that IP allowlist includes Vercel IPs
- Ensure tables are created in production

## Production Security Checklist

Before going live:
- [ ] Remove all debug console.log statements
- [ ] Enable RLS on all tables (or implement API layer)
- [ ] Use production Stripe keys (not test keys)
- [ ] Use production Clerk instance
- [ ] Set up error monitoring (Sentry recommended)
- [ ] Configure proper CORS origins (not '*')
- [ ] Enable HTTPS (Vercel does this automatically)
- [ ] Add Content Security Policy headers
- [ ] Set up automated backups for database

## Cost Estimation (Monthly)

**Vercel:** Free tier (good for starters)
- 100GB bandwidth
- 6000 build minutes
- Serverless functions

**Supabase:** Free tier
- 500MB database
- 2GB bandwidth

**Stripe:** Pay per transaction (2.9% + 30¢)

**Clerk:** Free tier (up to 5,000 MAU)

**Railway/Render:** $5-7/month for backend server

## Support

If issues arise:
1. Check Vercel deployment logs
2. Test locally first: `npm run build` then `npm run preview`
3. Verify all env variables are set
4. Check browser console for errors
5. Test backend endpoints separately

## Next Steps After Deployment

1. Set up Google Analytics
2. Add SEO meta tags
3. Create sitemap.xml
4. Set up error monitoring (Sentry)
5. Add PWA support
6. Implement email notifications
7. Add admin dashboard
8. Set up automated testing
