'use server';
import { auth } from '@/lib/better-auth';
import { headers } from 'next/headers';
import { prisma } from 'prisma/prisma.service';
import { z } from 'zod';

export const createOrganization = async (
	initialState: any,
	formData: FormData,
) => {
	const schema = z.object({
		name: z
			.string()
			.min(1, 'Organization name is required')
			.max(100, 'Name is too long'),
		slug: z
			.string()
			.min(1, 'Organization slug is required')
			.max(100, 'Name is too long')
			.regex(
				/^[a-z0-9-]+$/,
				'Slug can only contain lowercase letters, numbers, and hyphens',
			)
			.transform((val) => val.toLowerCase())
			.refine(
				async (val: string) => {
					const res = await auth.api.checkOrganizationSlug({
						body: {
							slug: val,
						},
					});
					return res?.status;
				},
				{ message: 'Slug must be unique' },
			),
	});

	const fields = {
		name: (formData.get('name') as string).trim(),
		slug: (formData.get('slug') as string).trim(),
	};

	const validatedFields = await schema.safeParseAsync(fields);

	if (!validatedFields.success) {
		return {
			success: false,
			errors: validatedFields.error.flatten().fieldErrors,
			fields,
		};
	}

	const requestHeaders = await headers();

	const session = await auth.api.getSession({
		query: {
			disableCookieCache: true,
		},
		headers: requestHeaders,
	});

	const org = await auth.api.createOrganization({
		body: {
			...fields,
			userId: session?.user?.id,
			keepCurrentActiveOrganization: true,
		},
		headers: requestHeaders,
	});

	return {
		success: true,
		orgId: org?.id,
		message: 'Created successfully',
	};
};

export const listOrganizations = async (userId: any) => {
	console.log(userId);
	const organizations = await prisma.organization.findMany({
		where: {
			members: {
				some: {
					userId: userId,
				},
			},
		},
	});

	return organizations;
};
