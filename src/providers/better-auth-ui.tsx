'use client';

import { authClient } from '@/lib/better-auth';
import { IWithChild } from '@/types/common';
import { AuthUIProvider } from '@daveyplate/better-auth-ui';
import { useRouter } from 'next/navigation';

export function BetterAuthProvider({ children }: IWithChild) {
	const router = useRouter();

	return (
		<AuthUIProvider
			authClient={authClient}
			navigate={router.push}
			replace={router.replace}
			onSessionChange={() => {
				router.refresh();
			}}
			organization={true}
			apiKey={false}
		>
			{children}
		</AuthUIProvider>
	);
}
