import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { createAuthClient } from 'better-auth/react';
import { apiKey, organization } from 'better-auth/plugins';
import { apiKeyClient, organizationClient } from 'better-auth/client/plugins';
import { sendEmail } from './resend';
import { prisma } from 'prisma/prisma.service';

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
		sendResetPassword: async ({ user, url }: any) => {
			await sendEmail(process.env.RESEND_API_KEY, {
				from: 'Acme <onboarding@resend.dev>',
				to: user.email,
				subject: 'Email Verification',
				html: `Click the link to verify your email: ${url}`,
			});
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }: any) => {
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
	databaseHooks: {
		session: {
			create: {
				before: async (session: any) => {
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
				},
			},
		},
	},
	plugins: [
		nextCookies(),
		organization({
			autoCreateOrganizationOnSignUp: true,
			sendInvitationEmail: async ({ email, organization, invitation }: any) => {
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
