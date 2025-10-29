'use server';

import Stripe from 'stripe';
import { headers } from 'next/headers';
import { auth } from '@/lib/better-auth';
import { prisma } from 'prisma/prisma.service';

export type PlanTier = 'free' | 'basic' | 'premium';

const PLAN_TO_PRICE_ENV: Record<Exclude<PlanTier, 'free'>, string> = {
	basic: process.env.STRIPE_PRODUCT_PRICE_ID_BASIC || '',
	premium: process.env.STRIPE_PRODUCT_PRICE_ID_PREMIUM || '',
};

function getStripe() {
	const key = process.env.STRIPE_SECRET_KEY;
	if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
	return new Stripe(key, { apiVersion: '2024-06-20' });
}

export async function getCurrentUserWithSubscription() {
	const hdrs = await headers();
	const session = await auth.api.getSession({ headers: hdrs });
	const user = (session as any)?.user as
		| { id: string; email?: string }
		| undefined;
	if (!user) return { user: null, subscription: null } as const;

	const subscription = await prisma.subscription.findFirst({
		where: { referenceId: user.id, status: { in: ['active', 'trialing'] } },
	});

	return { user, subscription } as const;
}

export async function getSubscriptionStatus() {
	const { user, subscription } = await getCurrentUserWithSubscription();
	if (!user) return { active: false, plan: 'none' as const };
	return {
		active: Boolean(subscription),
		plan: (subscription?.plan as any) ?? 'none',
	} as const;
}

export async function createCheckoutSession(plan: PlanTier) {
	const { user } = await getCurrentUserWithSubscription();
	if (!user) throw new Error('Not authenticated');

	// Check if there is already a subscription for this user
	const existing = await prisma.subscription.findFirst({
		where: { referenceId: user.id },
	});

	if (plan === 'free') {
		// If switching from a paid Stripe subscription, cancel it first
		if (existing?.stripeSubscriptionId) {
			const stripe = getStripe();
			try {
				await stripe.subscriptions.cancel(existing.stripeSubscriptionId);
			} catch {}
		}

		await prisma.subscription.upsert({
			where: { referenceId: user.id },
			create: {
				id: crypto.randomUUID(),
				plan: 'free',
				referenceId: user.id,
				status: 'active',
			},
			update: {
				plan: 'free',
				status: 'active',
				stripeCustomerId: null,
				stripeSubscriptionId: null,
				periodStart: null,
				periodEnd: null,
				trialStart: null,
				trialEnd: null,
				cancelAtPeriodEnd: false,
			},
		} as any);
		return { url: '/' } as const;
	}

	const priceId = PLAN_TO_PRICE_ENV[plan];
	if (!priceId) throw new Error(`Price not configured for plan: ${plan}`);

	// Ensure stripe customer
	let stripeCustomerId: string | null = null;
	const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
	stripeCustomerId = dbUser?.stripeCustomerId ?? null;

	const stripe = getStripe();

	// Validate price exists under the current Stripe account/key to avoid cryptic errors
	try {
		await stripe.prices.retrieve(priceId);
	} catch (e: any) {
		throw new Error(
			`Stripe cannot find price '${priceId}'. Check that your STRIPE_SECRET_KEY belongs to the same Stripe account and mode (test/live) as the price, and that the price ID is correct. Original: ${e?.message || e}`,
		);
	}
	if (!stripeCustomerId) {
		const customer = await stripe.customers.create({ email: dbUser?.email });
		stripeCustomerId = customer.id;
		await prisma.user.update({
			where: { id: user.id },
			data: { stripeCustomerId },
		});
	}

	const origin =
		(await headers()).get('origin') ||
		process.env.APP_URL ||
		'http://localhost:3000';
	const session = await stripe.checkout.sessions.create({
		mode: 'subscription',
		customer: stripeCustomerId,
		line_items: [{ price: priceId, quantity: 1 }],
		success_url: `${origin}/account?checkout=success`,
		cancel_url: `${origin}/account?checkout=cancel`,
		metadata: {
			userId: user.id,
			plan,
			previousSubscriptionId: existing?.stripeSubscriptionId || '',
		},
	});

	return { url: session.url! } as const;
}

export async function setActiveSubscriptionFromStripe(payload: {
	plan: string;
	stripeCustomerId: string;
	stripeSubscriptionId: string;
	status: string;
	periodStart?: Date | null;
	periodEnd?: Date | null;
}) {
	// Find the user by stripeCustomerId
	const user = await prisma.user.findFirst({
		where: { stripeCustomerId: payload.stripeCustomerId },
	});
	if (!user) return;

	await prisma.subscription.upsert({
		where: { referenceId: user.id },
		create: {
			id: crypto.randomUUID(),
			plan: payload.plan,
			referenceId: user.id,
			stripeCustomerId: payload.stripeCustomerId,
			stripeSubscriptionId: payload.stripeSubscriptionId,
			status: payload.status,
			periodStart: payload.periodStart || undefined,
			periodEnd: payload.periodEnd || undefined,
		},
		update: {
			plan: payload.plan,
			stripeSubscriptionId: payload.stripeSubscriptionId,
			status: payload.status,
			periodStart: payload.periodStart || undefined,
			periodEnd: payload.periodEnd || undefined,
		},
	} as any);
}
