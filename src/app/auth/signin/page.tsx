import { getSession } from '@/libs/auth-client';
import { redirect } from 'next/navigation';
import FormLogin from './form';

export default async function Page({ searchParams }: any) {
	const session = await getSession();
	const redirectTo = searchParams.redirect || '/admin';

	if (session) {
		return redirect(redirectTo);
	}

	return <FormLogin redirectTo={redirectTo} />;
}
