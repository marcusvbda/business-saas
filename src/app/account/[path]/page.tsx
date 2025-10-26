import AdminTemplate from '@/components/admin-template';
import OnlyClient from '@/components/only-client';
import { AccountView } from '@daveyplate/better-auth-ui';

export default async function AccountPage({
	params,
}: {
	params: Promise<{ path: string }>;
}) {
	const { path } = await params;

	return (
		<AdminTemplate>
			<main className="container p-4 md:p-6">
				<OnlyClient>
					<AccountView path={path} />
				</OnlyClient>
			</main>
		</AdminTemplate>
	);
}
