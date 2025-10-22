import { getSession } from '@/libs/auth-client';
import { redirect } from 'next/navigation';
import FormLogin from './form';

export default async function Page() {
	const session = await getSession();

	if (session) {
		return redirect(`/admin`);
	}

	return <FormLogin />;
}
