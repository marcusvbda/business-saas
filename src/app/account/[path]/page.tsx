import AdminTemplate from '@/components/admin-template';
import OnlyClient from '@/components/only-client';
import AccountSubscriptionGate from '@/components/account-subscription-gate';
import { IWithParams } from '@/types/common';
import { AccountView } from '@daveyplate/better-auth-ui';

export default async function AccountPage({ params }: IWithParams) {
	const { path } = await params;

	return (
		<AdminTemplate
			breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Accounts' }]}
		>
			<main className="container p-4 md:p-6">
				<OnlyClient>
					<AccountView path={path} />
					<AccountSubscriptionGate />
				</OnlyClient>
			</main>
		</AdminTemplate>
	);
}
