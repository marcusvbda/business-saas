import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from './server/auth';

export const publicRoutes = [
	'/auth',
	'/_next',
	'/favicon.ico',
	'/assets',
	'/api/auth',
	'/organization/accept-invitation',
	'/stripe/webhook',
];

export async function proxy(request: NextRequest) {
	const url = request.nextUrl.clone();

	const pathName = url.pathname;
	const isPublicAuth = publicRoutes.some((x: string) => pathName.startsWith(x));

	const res = NextResponse.next();

	if (!isPublicAuth) {
		const session = await getSession();
		if (!session) {
			const redirectBack = url.pathname;
			url.pathname = `/auth/sign-in`;
			url.searchParams.set('redirectTo', redirectBack);

			return NextResponse.redirect(url);
		}
		const sessionStr = JSON.stringify(session?.user);
		res.headers.set('x-user-logged', sessionStr);
	}

	return res;
}
