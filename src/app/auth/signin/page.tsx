import { LoginForm } from '@/components/login-form';
import { getSession } from '@/lib/auth-client';
import { redirect } from 'next/navigation';

export default async function Page({ searchParams }: any) {
	const session = await getSession();
	const queryParams = await searchParams
	const redirectTo = queryParams?.redirect ? decodeURIComponent(queryParams.redirect): "/";

	if (session) {
		return redirect(redirectTo);
	}

	return <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
		<div className="w-full max-w-sm md:max-w-4xl">
			<LoginForm redirectTo={redirectTo}/>
		</div>
    </div>
}
