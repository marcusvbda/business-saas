'use client';

import { useEffect, useState } from 'react';
import SubscriptionPlans from '@/components/subscription-plans';
import { getSubscriptionStatus } from '@/server/subscriptions';

export default function AccountSubscriptionGate() {
	const [currentPlan, setCurrentPlan] = useState<
		'none' | 'free' | 'basic' | 'premium'
	>('none');

	useEffect(() => {
		let isMounted = true;
		(async () => {
			try {
				const data = await getSubscriptionStatus();
				if (!isMounted) return;
				setCurrentPlan((data.plan as any) ?? 'none');
			} catch {
				if (!isMounted) return;
				setCurrentPlan('none');
			}
		})();
		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div className="mt-6">
			<h3 className="mb-2 text-lg font-semibold">Choose a plan</h3>
			<SubscriptionPlans currentPlan={currentPlan} />
		</div>
	);
}
