'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { authClient } from '@/lib/better-auth';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubscriptionPlansProps {
	currentPlan?: 'none' | 'free' | 'basic' | 'premium';
}

const plans = [
	{
		name: 'free',
		displayName: 'Free',
		description: 'Perfect for trying out our platform',
		price: '$0',
		period: '/month',
		features: ['1 project', '1GB storage', 'Basic support', 'Community access'],
		highlighted: false,
	},
	{
		name: 'basic',
		displayName: 'Basic',
		description: 'Great for small projects and teams',
		price: '$10',
		period: '/month',
		features: [
			'Up to 3 projects',
			'5GB storage',
			'Priority support',
			'Advanced features',
			'7-day free trial',
		],
		highlighted: true,
	},
	{
		name: 'premium',
		displayName: 'Premium',
		description: 'For growing businesses',
		price: '$29',
		period: '/month',
		features: [
			'Up to 20 projects',
			'50GB storage',
			'Premium support',
			'All advanced features',
			'14-day free trial',
		],
		highlighted: false,
	},
];

export default function SubscriptionPlans({
	currentPlan = 'none',
}: SubscriptionPlansProps) {
	const [loading, setLoading] = useState<string | null>(null);

	const handleUpgrade = async (planName: string) => {
		if (planName === 'free') {
			return;
		}

		setLoading(planName);

		try {
			const { error, data } = await authClient.subscription.upgrade({
				plan: planName,
				successUrl: `${window.location.origin}/account/subscription?success=true`,
				cancelUrl: `${window.location.origin}/account/subscription`,
			});

			if (error) {
				toast.error(error.message || 'Failed to start checkout');
				setLoading(null);
				return;
			}

			if (data?.url) {
				window.location.href = data.url;
			} else {
				toast.success('Redirecting to checkout...');
			}
		} catch (error) {
			console.error('Error upgrading subscription:', error);
			toast.error('Failed to start checkout. Please try again.');
			setLoading(null);
		}
	};

	const isCurrentPlan = (planName: string) => {
		return currentPlan === planName;
	};

	const isUpgradeDisabled = (planName: string) => {
		return planName === 'free' || loading !== null;
	};

	return (
		<div className="w-full">
			{/* Subscription Plans Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{plans.map((plan) => {
					const isCurrent = isCurrentPlan(plan.name);
					const isDisabled = isUpgradeDisabled(plan.name);
					const isLoading = loading === plan.name;

					return (
						<Card
							key={plan.name}
							className={cn(
								'relative flex flex-col',
								plan.highlighted && 'border-primary shadow-lg',
							)}
						>
							{plan.highlighted && (
								<div className="absolute -top-3 left-1/2 -translate-x-1/2">
									<span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
										Most Popular
									</span>
								</div>
							)}

							<CardHeader>
								<CardTitle className="text-2xl">{plan.displayName}</CardTitle>
								<CardDescription>{plan.description}</CardDescription>
								<div className="mt-4">
									<span className="text-4xl font-bold">{plan.price}</span>
									<span className="text-muted-foreground">{plan.period}</span>
								</div>
							</CardHeader>

							<CardContent className="flex-1 space-y-4">
								<ul className="space-y-3">
									{plan.features.map((feature, index) => (
										<li key={index} className="flex items-start gap-2">
											<Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
											<span className="text-sm">{feature}</span>
										</li>
									))}
								</ul>
							</CardContent>

							<CardFooter>
								<Button
									className="w-full"
									variant={
										isCurrent
											? 'secondary'
											: plan.highlighted
												? 'default'
												: 'outline'
									}
									disabled={isDisabled || isLoading}
									onClick={() => handleUpgrade(plan.name)}
								>
									{isLoading
										? 'Processing...'
										: isCurrent
											? 'Current Plan'
											: plan.name === 'free'
												? 'Current Plan'
												: 'Upgrade'}
								</Button>
							</CardFooter>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
