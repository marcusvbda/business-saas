'use server';
import { auth } from '@/lib/better-auth';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';

export const getSession = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return session;
};

export const signInEmail = async (
	email: string,
	password: string,
	rememberMe: boolean
) => {
	try {
		return await auth.api.signInEmail({
			body: {
				email,
				password,
				rememberMe,
			},
		});
	} catch (error) {
		if (error instanceof APIError) {
			return error.body.message;
		}

		console.log(error);
		return 'Something went wrong. Please try again.';
	}
};

export const signUpEmail = async (email: string, password: string) => {
	try {
		return await auth.api.signUpEmail({
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
};

export const signOut = async () => {
	return await auth.api.signOut({
		headers: await headers(),
	});
};

export const signInSocial = async (provider: string) => {
	return await auth.api.signInSocial({
		headers: await headers(),
		body: {
			provider,
			callbackURL: '/',
			disableRedirect: true,
		},
	});
};
