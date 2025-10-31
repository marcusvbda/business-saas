'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/better-auth';
import { getUserSubscriptions } from '@/server/subscriptions';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import SubscriptionPlans from '@/components/subscription-plans';

interface SubscriptionManagementProps {
	initialSubscription: {
		plan: string;
		status: string | null;
		subscriptionId?: string;
		limits?: any;
		periodEnd?: Date | string;
		trialEnd?: Date | string;
	};
}

export default function SubscriptionManagement({
	initialSubscription,
}: SubscriptionManagementProps) {
	const [subscriptions, setSubscriptions] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [showPlans, setShowPlans] = useState(false);

	useEffect(() => {
		loadSubscriptions();
	}, []);

	const loadSubscriptions = async () => {
		try {
			const data = await getUserSubscriptions();
			setSubscriptions(data);
		} catch (error) {
			console.error('Error loading subscriptions:', error);
		}
	};

	const handleCancel = async (subscriptionId: string) => {
		if (!confirm('Are you sure you want to cancel this subscription?')) return;

		setLoading(true);
		try {
			const { error, data } = await authClient.subscription.cancel({
				subscriptionId,
				returnUrl: window.location.href,
			});

			if (error) {
				toast.error(error.message || 'Failed to cancel subscription');
				return;
			}

			if (data?.url) {
				window.location.href = data.url;
			} else {
				toast.success('Subscription cancelled successfully');
				await loadSubscriptions();
			}
		} catch (error) {
			console.error('Error cancelling subscription:', error);
			toast.error('Failed to cancel subscription. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleRestore = async (subscriptionId: string) => {
		setLoading(true);
		try {
			const { error } = await authClient.subscription.restore({
				subscriptionId,
			});

			if (error) {
				toast.error(error.message || 'Failed to restore subscription');
				return;
			}

			toast.success('Subscription restored successfully');
			await loadSubscriptions();
		} catch (error) {
			console.error('Error restoring subscription:', error);
			toast.error('Failed to restore subscription. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleBillingPortal = async () => {
		try {
			const { error, data } = await authClient.subscription.billingPortal({
				returnUrl: window.location.href,
			});

			if (error) {
				toast.error(error.message || 'Failed to open billing portal');
				return;
			}

			if (data?.url) {
				window.location.href = data.url;
			}
		} catch (error) {
			console.error('Error opening billing portal:', error);
			toast.error('Failed to open billing portal. Please try again.');
		}
	};

	const getStatusBadge = (status: string | null) => {
		const statusMap: Record<string, { label: string; variant: any }> = {
			active: { label: 'Active', variant: 'default' },
			trialing: { label: 'Trial', variant: 'secondary' },
			cancelled: { label: 'Cancelled', variant: 'destructive' },
			past_due: { label: 'Past Due', variant: 'destructive' },
			unpaid: { label: 'Unpaid', variant: 'destructive' },
		};

		const config =
			status && status in statusMap
				? statusMap[status]
				: { label: 'Free', variant: 'outline' };

		return <Badge variant={config.variant as any}>{config.label}</Badge>;
	};

	const formatDate = (date: Date | string | undefined) => {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	// Show plans if no subscription or if user wants to upgrade
	if (
		showPlans ||
		initialSubscription.plan === 'free' ||
		!initialSubscription.status
	) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Choose Your Plan</h1>
						<p className="text-muted-foreground mt-2">
							Select the perfect plan for your needs
						</p>
					</div>
					{initialSubscription.plan !== 'free' && (
						<Button variant="outline" onClick={() => setShowPlans(false)}>
							Back to Current Subscription
						</Button>
					)}
				</div>

				<SubscriptionPlans currentPlan={initialSubscription.plan as any} />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Subscription Management</h1>
					<p className="text-muted-foreground mt-2">
						Manage your subscription and billing
					</p>
				</div>
				<Button onClick={() => setShowPlans(true)}>Upgrade Plan</Button>
			</div>

			{/* Current Subscription */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Current Plan</CardTitle>
							<CardDescription>
								{initialSubscription.plan
									? initialSubscription.plan.charAt(0).toUpperCase() +
										initialSubscription.plan.slice(1)
									: 'Free'}
							</CardDescription>
						</div>
						{getStatusBadge(initialSubscription.status)}
					</div>
				</CardHeader>

				{initialSubscription.limits && (
					<CardContent>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<p className="text-sm text-muted-foreground">Projects Limit</p>
								<p className="text-2xl font-bold">
									{initialSubscription.limits.projects === -1
										? 'Unlimited'
										: initialSubscription.limits.projects}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Storage Limit</p>
								<p className="text-2xl font-bold">
									{initialSubscription.limits.storage === -1
										? 'Unlimited'
										: `${initialSubscription.limits.storage}GB`}
								</p>
							</div>
						</div>

						{(initialSubscription.periodEnd ||
							initialSubscription.trialEnd) && (
							<div className="mt-4 space-y-2">
								{initialSubscription.trialEnd && (
									<p className="text-sm">
										<span className="text-muted-foreground">Trial ends:</span>{' '}
										<span className="font-medium">
											{formatDate(initialSubscription.trialEnd)}
										</span>
									</p>
								)}
								{initialSubscription.periodEnd && (
									<p className="text-sm">
										<span className="text-muted-foreground">
											Next billing date:
										</span>{' '}
										<span className="font-medium">
											{formatDate(initialSubscription.periodEnd)}
										</span>
									</p>
								)}
							</div>
						)}
					</CardContent>
				)}

				<CardFooter className="flex gap-2">
					{initialSubscription.subscriptionId && (
						<>
							<Button variant="outline" onClick={handleBillingPortal}>
								Manage Billing
							</Button>
							{initialSubscription.status === 'cancelled' ? (
								<Button
									variant="default"
									onClick={() =>
										handleRestore(initialSubscription.subscriptionId!)
									}
									disabled={loading}
								>
									{loading ? 'Processing...' : 'Restore Subscription'}
								</Button>
							) : (
								<Button
									variant="destructive"
									onClick={() =>
										handleCancel(initialSubscription.subscriptionId!)
									}
									disabled={loading}
								>
									{loading ? 'Processing...' : 'Cancel Subscription'}
								</Button>
							)}
						</>
					)}
				</CardFooter>
			</Card>

			{/* All Subscriptions */}
			{subscriptions.length > 0 && (
				<div className="space-y-4">
					<h2 className="text-2xl font-bold">All Subscriptions</h2>
					{subscriptions.map((sub) => (
						<Card key={sub.id}>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>
											{sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}
										</CardTitle>
										<CardDescription>
											{formatDate(sub.periodStart)} -{' '}
											{formatDate(sub.periodEnd)}
										</CardDescription>
									</div>
									{getStatusBadge(sub.status)}
								</div>
							</CardHeader>
							<CardContent>
								{sub.limits && (
									<div className="grid gap-4 md:grid-cols-2">
										<div>
											<p className="text-sm text-muted-foreground">Projects</p>
											<p className="text-lg font-semibold">
												{sub.limits.projects === -1
													? 'Unlimited'
													: sub.limits.projects}
											</p>
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Storage</p>
											<p className="text-lg font-semibold">
												{sub.limits.storage === -1
													? 'Unlimited'
													: `${sub.limits.storage}GB`}
											</p>
										</div>
									</div>
								)}
							</CardContent>
							<CardFooter>
								<Button
									variant="outline"
									size="sm"
									onClick={handleBillingPortal}
								>
									Manage
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
