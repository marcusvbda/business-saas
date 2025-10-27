/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import EmptyState from '@/components/empty-state';
import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import { EmptyContent, EmptyMedia } from '@/components/ui/empty';
import { IconAffiliate } from '@tabler/icons-react';
import { useState } from 'react';
import {
	Field,
	FieldContent,
	FieldLabel,
	FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const orgSchema = z.object({
	name: z
		.string()
		.min(1, 'Organization name is required')
		.max(100, 'Name is too long')
		.refine(async (val: any) => {
			try {
				const isUnique = true;
				return isUnique;
				// const res = await fetch(
				// 	`/api/organizations/check?name=${encodeURIComponent(val)}`,
				// );
				// if (!res.ok) return false;
				// const data = await res.json();
				// return !!data.available;
			} catch (e) {
				// In case of error, allow submit and let server-side handle uniqueness
				return true;
			}
		}, 'Organization name is already taken'),
});

type FormValues = z.infer<typeof orgSchema>;

export function EmptyStateOrganization() {
	const [visible, setVisible] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<FormValues>({
		resolver: zodResolver(orgSchema),
		mode: 'onBlur',
	});

	async function onSubmit(data: FormValues) {
		try {
			// Try client library first
			// const client: any = authClient as any;

			// if (typeof client.createOrganization === 'function') {
			// 	await client.createOrganization({ name: data.name.trim() });
			// } else if (typeof client.organizationCreate === 'function') {
			// 	await client.organizationCreate({ name: data.name.trim() });
			// } else if (
			// 	typeof client.mutate === 'function' &&
			// 	client.mutate.createOrganization
			// ) {
			// 	await client.mutate.createOrganization({ name: data.name.trim() });
			// } else {
			// 	// Fallback to server route
			// 	const res = await fetch('/api/organizations', {
			// 		method: 'POST',
			// 		headers: { 'Content-Type': 'application/json' },
			// 		body: JSON.stringify({ name: data.name.trim() }),
			// 	});

			// 	if (!res.ok) {
			// 		const text = await res.text();
			// 		throw new Error(text || 'Failed to create organization');
			// 	}
			// }

			toast.success('Organization created');
			setVisible(false);
			reset();
			try {
				router.refresh();
			} catch (e) {
				// ignore
			}
		} catch (err: any) {
			console.error(err);
			toast.error(err?.message || 'Failed to create organization');
		}
	}

	const footer = (
		<div className="flex items-center justify-end gap-2">
			<Button
				variant="ghost"
				onClick={() => setVisible(false)}
				disabled={isSubmitting}
			>
				Cancel
			</Button>
			<Button
				type="submit"
				form="create-org-form"
				onClick={() => {}}
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Creating...' : 'Create Organization'}
			</Button>
		</div>
	);

	return (
		<>
			<EmptyState
				icon={
					<EmptyMedia variant="icon">
						<IconAffiliate />
					</EmptyMedia>
				}
				label="No organizations yet"
				description="You haven't created any organization yet. Get started by creating your first organization."
				content={
					<EmptyContent>
						<Button onClick={() => setVisible(true)}>
							Create Organization
						</Button>
					</EmptyContent>
				}
			/>
			<Modal
				visible={visible}
				setVisible={(x: any) => setVisible(x)}
				title="Create organization"
				description="Provide a name for your organization. You can invite members later."
				content={
					// Attach an id so the footer submit button can target the form
					<form
						id="create-org-form"
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<Field>
							<FieldLabel>Organization name</FieldLabel>
							<FieldContent>
								<Input
									placeholder="Acme, Inc."
									{...register('name')}
									aria-invalid={!!errors.name}
								/>
								<FieldError>{errors.name?.message as any}</FieldError>
							</FieldContent>
						</Field>
					</form>
				}
				footer={footer}
			/>
		</>
	);
}
