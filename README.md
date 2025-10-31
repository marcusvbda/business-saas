This is a [Next.js](https://nextjs.org) SaaS application with authentication, organizations, and Stripe subscriptions powered by [Better Auth](https://www.better-auth.com).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

- ✅ Email/Password Authentication with Better Auth
- ✅ Social Authentication (GitHub, Google)
- ✅ Organization/Team Management
- ✅ Stripe Subscriptions Integration
- ✅ API Key Management
- ✅ Subscription Plans (Starter, Professional, Enterprise)
- ✅ Monthly & Annual Billing
- ✅ Free Trials with Abuse Prevention
- ✅ Subscription Management UI
- ✅ Usage Limits & Billing Portal

## Stripe Subscriptions

The application includes a complete Stripe subscription system with:

- **Basic Plan**: $10/month (7-day trial) - 3 projects, 5GB storage
- **Premium Plan**: $29/month (14-day trial) - 20 projects, 50GB storage
- **Free Plan**: 1 project, 1GB storage

### Environment Variables Required

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRODUCT_PRICE_ID_BASIC=price_...
STRIPE_PRODUCT_PRICE_ID_PREMIUM=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Setup Steps

1. Get your Stripe API keys from https://dashboard.stripe.com
2. Create products and prices in Stripe Dashboard
3. For local testing, use Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3002/api/auth/stripe/webhook
   ```
4. Add the webhook signing secret to `.env` as `STRIPE_WEBHOOK_SECRET`

## Key Pages

- `/account/subscription` - Manage subscriptions and billing
- `/auth/*` - Authentication pages
- `/organization/*` - Organization management

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://www.better-auth.com)
- [Better Auth Stripe Plugin](https://www.better-auth.com/docs/plugins/stripe)
- [Stripe Documentation](https://stripe.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
