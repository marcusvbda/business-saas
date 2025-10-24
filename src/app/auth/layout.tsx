import { getSession } from '@/actions/auth';
import { redirect } from 'next/navigation';

export default async function layout({ searchParams, children }: any) {
	const session = await getSession();
	const queryParams = await searchParams;
	const redirectTo = queryParams?.redirect
		? decodeURIComponent(queryParams.redirect)
		: '/';

	if (session) {
		return redirect(redirectTo);
	}
	return children;
}
