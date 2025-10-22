import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from './libs/auth-client';

export async function proxy(request: NextRequest) {
	const session = await getSession();
	const res = NextResponse.next();
	if (!session) {
		const url = request.nextUrl.clone();
		const redirectBack = encodeURIComponent(url.pathname);
		url.pathname = `/auth/signin`;
		url.searchParams.set('redirect', redirectBack);
		return NextResponse.redirect(url);
	}
	const sessionStr = JSON.stringify(session);
	res.headers.set('x-user-session', sessionStr);
	return res;
}

export const config = {
	matcher: ['/admin/:path*'],
};
