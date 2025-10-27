'use server';
import { auth } from '@/lib/better-auth';
import { sendEmail } from '@/lib/resend';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import { prisma } from 'prisma/prisma.service';

export const getSession = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return session;
};

export const signInEmail = async (
	email: string,
	password: string,
	rememberMe: boolean,
) => {
	try {
		await auth.api.signInEmail({
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

export const createSession = async (session: any) => {
	const user = await prisma.user.findUnique({
		where: { id: session?.userId },
	});

	return {
		data: {
			...session,
			user: {
				...user,
			},
		},
	};
};

export const sendResetPassword = async ({ user, url }: any) => {
	await sendEmail(process.env.RESEND_API_KEY, {
		from: 'Acme <onboarding@resend.dev>',
		to: user.email,
		subject: 'Email Verification',
		html: `Click the link to verify your email: ${url}`,
	});
};

export const sendVerificationEmail = async ({ user, url }: any) => {
	await sendEmail(process.env.RESEND_API_KEY, {
		from: 'Acme <onboarding@resend.dev>',
		to: user.email,
		subject: 'Email Verification',
		html: `Click the link to verify your email: ${url}`,
	});
};

export const sendInvitationEmail = async ({
	email,
	organization,
	invitation,
}: any) => {
	const inviteLink = `${process.env.BETTER_AUTH_URL}/organization/accept-invitation?invitationId=${invitation.id}`;
	await sendEmail(process.env.RESEND_API_KEY, {
		from: 'Acme <onboarding@resend.dev>',
		to: email,
		subject: `Invitation to ${organization.name}`,
		html: `Click the link to accept the invite: ${inviteLink}`,
	});
};
