import { createAuthClient } from 'better-auth/react';
import { ReactNode } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { PrismaClient } from '@prisma/client';
import { APIError, betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
	database: prismaAdapter(new PrismaClient(), {
		provider: 'mysql',
	} as any),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		minPasswordLength: 6,
		maxPasswordLength: 20,
	},
	plugins: [nextCookies()],
});

export const authClient = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL,
});

export async function getSession() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return session;
}

export const authMiddleware = async (
	children: ReactNode,
): Promise<ReactNode> => {
	const session = await getSession();

	if (!session) {
		return redirect(`/auth/signin`);
	}

	return children;
};

export async function signInEmail(email: string, password: string) {
	try {
		await auth.api.signInEmail({
			body: {
				email,
				password,
			},
		});
	} catch (error) {
		if (error instanceof APIError) {
			return error.body.message;
		}

		console.log(error);
		return 'Something went wrong. Please try again.';
	}
}

export async function signUpEmail(email: string, password: string) {
	try {
		await auth.api.signUpEmail({
			body: {
				email,
				password,
				name: email,
			},
		});
	} catch (error) {
		if (error instanceof APIError) {
			return error.body.message;
		}

		console.log(error);
		return 'Something went wrong. Please try again.';
	}
}

export async function signOut() {
	await auth.api.signOut({
		headers: await headers(),
	});
}
