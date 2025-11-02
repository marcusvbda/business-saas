import AdminTemplate from '@/components/admin-template';
import OnlyClient from '@/components/only-client';
import SubscriptionManagement from '@/components/subscription-management';
import { getSubscriptionStatus } from '@/server/subscriptions';

export default async function SubscriptionPage() {
	const subscription = await getSubscriptionStatus();

	return (
		<AdminTemplate
			breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Subscription' }]}
			checkOrganization={false}
		>
			<main className="container p-4 md:p-6">
				<OnlyClient>
					<SubscriptionManagement initialSubscription={subscription} />
				</OnlyClient>
			</main>
		</AdminTemplate>
	);
}
