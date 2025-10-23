import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from './lib/auth-client';

export const publicRoutes = ['/auth','/_next',"/favicon.ico","/assets"];

export async function proxy(request: NextRequest) {
	const url = request.nextUrl.clone();

	const pathName = url.pathname;
	const isPublicAuth = publicRoutes.some((x:string)=> pathName.startsWith(x));

	const res = NextResponse.next();
	if(!isPublicAuth) {
		const session = await getSession();
		if (!session) {
			const redirectBack = encodeURIComponent(url.pathname);
			url.pathname = `/auth/signin`;
			url.searchParams.set('redirect', redirectBack);

			return NextResponse.redirect(url);
		}
		const sessionStr = JSON.stringify(session);
		res.headers.set('x-user-session', sessionStr);
	}
	
	return res;
}
