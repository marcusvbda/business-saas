import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { createAuthClient } from 'better-auth/react';
import { sendEmail } from './resend';
import { apiKey, organization } from 'better-auth/plugins';
import { apiKeyClient, organizationClient } from 'better-auth/client/plugins';

export const auth = betterAuth({
	database: prismaAdapter(new PrismaClient(), {
		provider: 'mysql',
	} as any),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		minPasswordLength: 6,
		maxPasswordLength: 20,
		requireEmailVerification: true,
		// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
		sendResetPassword: async ({ user, url }, request) => {
			await sendEmail(process.env.RESEND_API_KEY, {
				from: 'Acme <onboarding@resend.dev>',
				to: user.email,
				subject: 'Email Verification',
				html: `Click the link to verify your email: ${url}`,
			});
		},
	},
	emailVerification: {
		sendOnSignUp: true, // Automatically sends a verification email at signup
		autoSignInAfterVerification: true, // Automatically signIn the user after verification
		sendVerificationEmail: async ({ user, url }) => {
			await sendEmail(process.env.RESEND_API_KEY, {
				from: 'Acme <onboarding@resend.dev>',
				to: user.email,
				subject: 'Email Verification',
				html: `Click the link to verify your email: ${url}`,
			});
		},
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		},
	},
	plugins: [
		nextCookies(),
		organization({
			additionalFields: {
				publicId: {
					type: 'string',
					fieldName: 'public_id',
					required: false,
					input: false,
					unique: true,
					returned: true,
				},
			},

			sendInvitationEmail: async ({ email, organization, invitation }) => {
				const inviteLink = `${process.env.BETTER_AUTH_URL}/organization/accept-invitation?invitationId=${invitation.id}`;
				await sendEmail(process.env.RESEND_API_KEY, {
					from: 'Acme <onboarding@resend.dev>',
					to: email,
					subject: `Invitation to ${organization.name}`,
					html: `Click the link to accept the invite: ${inviteLink}`,
				});
			},
		}),
		apiKey(),
	],
});

export const authClient = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL,
	plugins: [organizationClient(), apiKeyClient()],
});
