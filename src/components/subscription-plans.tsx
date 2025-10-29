'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { createCheckoutSession } from '@/server/subscriptions';

type Props = {
	currentPlan?: 'none' | 'free' | 'basic' | 'premium';
};

export default function SubscriptionPlans({ currentPlan = 'none' }: Props) {
	const [isPending, startTransition] = useTransition();

	const subscribe = (plan: 'free' | 'basic' | 'premium') => {
		startTransition(async () => {
			const { url } = await createCheckoutSession(plan);
			window.location.href = url;
		});
	};

	return (
		<div className="grid gap-4 sm:grid-cols-3">
			<Card>
				<CardHeader>
					<CardTitle>Free</CardTitle>
					<CardDescription>$0/month</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						disabled={isPending || currentPlan === 'free'}
						onClick={() => subscribe('free')}
					>
						{currentPlan === 'free' ? 'Current plan' : 'Choose Free'}
					</Button>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Basic</CardTitle>
					<CardDescription>$10/month</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						disabled={isPending || currentPlan === 'basic'}
						onClick={() => subscribe('basic')}
					>
						{currentPlan === 'basic' ? 'Current plan' : 'Choose Basic'}
					</Button>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Premium</CardTitle>
					<CardDescription>$30/month</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						disabled={isPending || currentPlan === 'premium'}
						onClick={() => subscribe('premium')}
					>
						{currentPlan === 'premium' ? 'Current plan' : 'Choose Premium'}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
