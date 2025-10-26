import AdminTemplate from '@/components/admin-template';
import OnlyClient from '@/components/only-client';
import { IWithParams } from '@/types/common';
import { OrganizationView } from '@daveyplate/better-auth-ui';

export default async function OrganizationPage({ params }: IWithParams) {
	const { path } = await params;

	return (
		<AdminTemplate
			breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Organizations' }]}
		>
			<main className="container p-4 md:p-6">
				<OnlyClient>
					<OrganizationView path={path} />
				</OnlyClient>
			</main>
		</AdminTemplate>
	);
}
