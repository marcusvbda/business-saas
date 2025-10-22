'use client';

import { login } from '@/actions/auth';
import { redirect } from 'next/navigation';

export default function FormLogin({ redirectTo }: { redirectTo: string }) {
	const handlerLogin = async () => {
		await login();
		redirect(redirectTo);
	};

	return (
		<div className="flex min-h-svh w-full items-center justify-center">
			<button onClick={handlerLogin} className="w-full max-w-md">
				login
			</button>
		</div>
	);
}
