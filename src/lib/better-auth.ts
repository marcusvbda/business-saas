import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { createAuthClient } from 'better-auth/react';
import { apiKey, organization } from 'better-auth/plugins';
import { apiKeyClient, organizationClient } from 'better-auth/client/plugins';
import {
	createSession,
	sendInvitationEmail,
	sendResetPassword,
	sendVerificationEmail,
} from '@/server/auth';

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
		sendResetPassword,
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail,
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
				before: createSession,
			},
		},
	},
	plugins: [
		nextCookies(),
		organization({
			autoCreateOrganizationOnSignUp: true,
			sendInvitationEmail,
		}),
		apiKey(),
	],
});

export const authClient = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL,
	plugins: [organizationClient(), apiKeyClient()],
});
