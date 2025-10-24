import { LoginForm } from '@/components/login-form';

export default async function Page({ searchParams }: any) {
	const queryParams = await searchParams;
	const redirectTo = queryParams?.redirect
		? decodeURIComponent(queryParams.redirect)
		: '/';

	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm md:max-w-4xl">
				<LoginForm redirectTo={redirectTo} />
			</div>
		</div>
	);
}
