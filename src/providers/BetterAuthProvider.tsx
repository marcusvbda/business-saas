'use client';

import { authClient } from '@/lib/better-auth';
import { AuthUIProvider } from '@daveyplate/better-auth-ui';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

export function BetterAuthProvider({ children }: { children: ReactNode }) {
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
			apiKey={true}
			additionalFields={{
				company: {
					label: 'Company',
					placeholder: 'Your company name',
					description: 'Enter your company name',
					required: true,
					type: 'string',
				},
			}}
			signUp={{
				fields: ['company'],
			}}
		>
			{children}
		</AuthUIProvider>
	);
}
