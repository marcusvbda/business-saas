'use server';

import { auth } from '@/lib/better-auth';
import { headers } from 'next/headers';
import { prisma } from 'prisma/prisma.service';

export async function getSubscriptionStatus() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return { plan: 'free', status: null };
		}

		// Query subscriptions directly from database
		const subscriptions = await prisma.subscription.findMany({
			where: {
				referenceId: session.user.id,
				OR: [{ status: 'active' }, { status: 'trialing' }],
			},
			orderBy: {
				periodEnd: 'desc',
			},
		});

		const activeSubscription = subscriptions[0];

		if (!activeSubscription) {
			return { plan: 'free', status: null };
		}

		// Parse limits from plan configuration
		const limits = getPlanLimits(activeSubscription.plan);

		return {
			plan: activeSubscription.plan,
			status: activeSubscription.status,
			subscriptionId: activeSubscription.id,
			limits,
			periodEnd: activeSubscription.periodEnd,
			trialEnd: activeSubscription.trialEnd,
		};
	} catch (error) {
		console.error('Error getting subscription status:', error);
		return { plan: 'free', status: null };
	}
}

export async function getUserSubscriptions() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return [];
		}

		const subscriptions = await prisma.subscription.findMany({
			where: {
				referenceId: session.user.id,
			},
			orderBy: {
				periodEnd: 'desc',
			},
		});

		// Transform to include limits
		return subscriptions.map((sub) => ({
			...sub,
			limits: getPlanLimits(sub.plan),
		}));
	} catch (error) {
		console.error('Error getting user subscriptions:', error);
		return [];
	}
}

// Helper function to get plan limits based on plan name
function getPlanLimits(plan: string) {
	const limitsMap: Record<string, any> = {
		basic: {
			projects: 3,
			storage: 5,
		},
		premium: {
			projects: 20,
			storage: 50,
		},
	};

	return limitsMap[plan.toLowerCase()] || { projects: 1, storage: 1 };
}
