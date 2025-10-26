import OnlyClient from '@/components/only-client';
import { IWithParams } from '@/types/common';
import { AuthView } from '@daveyplate/better-auth-ui';

export default async function AuthPage({ params }: IWithParams) {
	const { path } = await params;

	return (
		<main className="w-full flex grow flex-col items-center justify-center self-center p-4 md:p-6">
			<OnlyClient>
				<AuthView path={path} />
			</OnlyClient>
		</main>
	);
}
